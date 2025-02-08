import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import Busboy from "busboy";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import sharp from "sharp";
import { Readable } from "stream";

// Create S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Utility: Convert a Next.js ReadableStream to Node.js Readable
function streamToNodeReadable(stream: ReadableStream<Uint8Array>): Readable {
  const reader = stream.getReader();
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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const artworks = await Artwork.find({});
    return NextResponse.json({ artworks });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Enhanced interface to also track a UUID for each file
interface PendingImageData {
  id: string; // The UUID passed from the client
  truncatedBaseName: string;
  fileBuffer: Buffer;
  mainKey: string;
  thumbKey: string;
  mainUrl: string;
  thumbUrl: string;
}

export async function POST(request: NextRequest) {
  try {
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

        const extensionIndex = filename.lastIndexOf(".");
        const baseName =
          extensionIndex !== -1
            ? filename.substring(0, extensionIndex)
            : filename;
        const truncatedBaseName =
          baseName.length > 60 ? baseName.substring(0, 60) : baseName;

        const mainKey = `${folderPath}${truncatedBaseName}.webp`;
        const thumbKey = `${folderPath}${truncatedBaseName}-thumb.webp`;
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
            truncatedBaseName,
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
            truncatedBaseName,
            fileBuffer,
            mainKey,
            thumbKey,
            mainUrl,
            thumbUrl,
          } = item;

          try {
            // Convert to main WebP
            const mainWebpBuffer = await sharp(fileBuffer)
              .webp({ quality: 80 })
              .toBuffer();

            // Convert to thumb WebP (400px wide)
            const thumbWebpBuffer = await sharp(fileBuffer)
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
            const artworkDoc = new Artwork({
              name: truncatedBaseName,
              src: mainUrl,
              alt: truncatedBaseName,
              thumbSrc: thumbUrl,
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

      // Stream the request body into Busboy
      const reader = request.body.getReader();
      const stream = new ReadableStream({
        async pull(controller) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        },
      });

      const nodeStream = streamToNodeReadable(stream);
      nodeStream.pipe(busboy);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
