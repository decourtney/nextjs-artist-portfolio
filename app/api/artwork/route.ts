import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import Busboy from "busboy";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import sharp from "sharp";
import { Readable } from "stream";
import {
  SanitizeAndShortenString,
  shortenName,
} from "@/utils/sanitizeAndShortenString";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";
import { Tag } from "@/models";

// Enhanced interface to also track a UUID for each file
interface PendingImageData {
  id: string; // The UUID passed from the client
  baseName: string;
  sanitizedFilename: string;
  fileBuffer: Buffer;
  mainKey: string;
  thumbKey: string;
  mainUrl: string;
  thumbUrl: string;
}

// Create S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // Add additional configuration for CORS
  requestHandler: {
    httpOptions: {
      timeout: 30000,
    },
  },
});

// Utility: Convert a Next.js ReadableStream to Node.js Readable
function webStreamToNodeReadable(
  webStream: ReadableStream<Uint8Array>
): Readable {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = {};
    if (category) {
      const categoryTag = await Tag.findOne({
        label: category,
        type: "category",
      });
      if (categoryTag) {
        query = { categories: categoryTag._id };
      }
    }

    const artworks = await Artwork.find(query)
      .populate("categories")
      .populate("medium")
      .populate("size");

    return NextResponse.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(_nextAuthOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const contentType = request.headers.get("content-type");
    if (!contentType) {
      return NextResponse.json(
        { error: "Content-Type header is missing" },
        { status: 400 }
      );
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });
    const pendingImages: PendingImageData[] = [];

    // We'll store the UUIDs in an array in the order they appear
    // Don't jumble them up by using an object or map
    // This way, we can match them to the files in the order they are uploaded
    const uuids: string[] = [];
    let fileIndex = 0;

    return new Promise<NextResponse>((resolve, reject) => {
      // Collect any form fields (including "uuids")
      busboy.on("field", (fieldname, value) => {
        // Each "uuids" field corresponds to one file in the same order
        if (fieldname === "uuids") {
          uuids.push(value);
        }
      });

      // Collect file data
      busboy.on("file", (fieldname, fileStream, info) => {
        const { filename } = info;
        const folderPath = process.env.NEXT_PUBLIC_AWS_IMAGES_FOLDER || "";

        // Locate where the file extension starts
        const extensionIndex = filename.lastIndexOf(".");

        // Get base file name without extension and shorten it
        const baseName = shortenName(
          extensionIndex !== -1
            ? filename.substring(0, extensionIndex)
            : filename
        );

        // Sanitize the filename for S3 key and image alt text
        const sanitizedFilename = SanitizeAndShortenString(baseName);
        const mainKey = `${folderPath}${sanitizedFilename}.webp`;
        const thumbKey = `${folderPath}thumbnails/${sanitizedFilename}-thumb.webp`;
        const mainUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${mainKey}`;
        const thumbUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${thumbKey}`;

        // Collect file into memory
        const chunks: Uint8Array[] = [];
        fileStream.on("data", (chunk) => {
          chunks.push(chunk as Uint8Array);
        });

        fileStream.on("end", () => {
          // Match this file with the next UUID in order
          const assignedId = uuids[fileIndex] || "NO_ID_FOUND";
          fileIndex++;

          pendingImages.push({
            id: assignedId,
            baseName,
            sanitizedFilename,
            fileBuffer: Buffer.concat(chunks),
            mainKey,
            thumbKey,
            mainUrl,
            thumbUrl,
          });
        });

        fileStream.on("error", (err) => {
          console.error("File stream error:", err);
          reject(
            NextResponse.json(
              { message: "Error reading file stream" },
              { status: 500 }
            )
          );
        });
      });

      // When all fields/files have been processed
      busboy.on("finish", async () => {
        const successes: Array<{
          id: string;
          mainUrl: string;
          thumbUrl: string;
          message: string;
        }> = [];
        const failures: Array<{
          id: string;
          message: string;
          error: string;
        }> = [];

        // Process each file
        for (const item of pendingImages) {
          const {
            id,
            baseName,
            sanitizedFilename,
            fileBuffer,
            mainKey,
            thumbKey,
            mainUrl,
            thumbUrl,
          } = item;

          try {
            const sharpImageOriginal = sharp(fileBuffer);
            const metadata = await sharpImageOriginal.metadata();
            const originalWidth = metadata.width;
            const originalHeight = metadata.height;

            // Convert to main WebP
            const mainWebpBuffer = await sharpImageOriginal
              .rotate()
              .webp({ quality: 80 })
              .toBuffer();

            // Convert to thumbnail WebP
            const thumbWebpBuffer = await sharp(fileBuffer)
              .rotate()
              .resize(400)
              .webp({ quality: 80 })
              .toBuffer();

            // Upload main image to S3
            const mainUpload = new Upload({
              client: s3Client,
              params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
                Key: mainKey,
                Body: mainWebpBuffer,
                ContentType: "image/webp",
              },
            });
            await mainUpload.done();

            // Upload thumbnail to S3
            const thumbUpload = new Upload({
              client: s3Client,
              params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
                Key: thumbKey,
                Body: thumbWebpBuffer,
                ContentType: "image/webp",
              },
            });
            await thumbUpload.done();

            // Insert a document into MongoDB
            const artworkDoc: ArtworkDocument = new Artwork({
              name: baseName,
              src: mainUrl,
              alt: sanitizedFilename,
              thumbSrc: thumbUrl,
              metaWidth: originalWidth,
              metaHeight: originalHeight,
            });
            await artworkDoc.save();

            successes.push({
              id, // Return the UUID so client knows which file succeeded
              mainUrl,
              thumbUrl,
              message: "Upload succeeded",
            });
          } catch (err) {
            console.error("Error uploading or inserting doc:", err);

            // Cleanup S3 if the file was partially uploaded
            try {
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
                  Key: mainKey,
                })
              );
            } catch (cleanupErr) {
              console.error(
                "Failed to delete mainKey during cleanup:",
                cleanupErr
              );
            }

            try {
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
                  Key: thumbKey,
                })
              );
            } catch (cleanupErr) {
              console.error(
                "Failed to delete thumbKey during cleanup:",
                cleanupErr
              );
            }

            failures.push({
              id, // Return the UUID so client can identify which file failed
              message: "Upload failed",
              error: String(err),
            });
          }
        }

        // Return info about which uploads succeeded / failed
        resolve(NextResponse.json({ successes, failures }, { status: 200 }));
      });

      busboy.on("error", (error) => {
        console.error("Busboy error:", error);
        reject(
          NextResponse.json(
            { message: "Error parsing form data" },
            { status: 500 }
          )
        );
      });

      // No body => can't proceed
      if (!request.body) {
        reject(
          NextResponse.json({ error: "No request body" }, { status: 400 })
        );
        return;
      }

      const nodeStream = webStreamToNodeReadable(request.body);
      nodeStream.pipe(busboy);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
