import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  CompleteMultipartUploadCommandOutput,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import Busboy from "busboy";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import sharp from "sharp";
import { Readable } from "stream";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper: Convert Next.js ReadableStream to Node.js Readable
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

// This interface describes the data we'll store for each uploaded file
interface PendingImageData {
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

    // We'll accumulate data here, but not upload immediately
    const pendingImages: PendingImageData[] = [];
    const formFields: Record<string, string> = {};

    return new Promise<NextResponse>((resolve, reject) => {
      busboy.on("field", (fieldname, value) => {
        formFields[fieldname] = value;
      });

      // For each file in the form
      busboy.on("file", (fieldname, fileStream, info) => {
        const { filename, mimeType } = info;
        const folderPath = process.env.NEXT_PUBLIC_AWS_IMAGES_FOLDER || "";

        // Figure out base name
        const extensionIndex = filename.lastIndexOf(".");
        const baseName =
          extensionIndex !== -1
            ? filename.substring(0, extensionIndex)
            : filename;

        const truncatedBaseName =
          baseName.length > 60 ? baseName.substring(0, 60) : baseName;

        // We'll store them as .webp
        const mainKey = `${folderPath}${truncatedBaseName}.webp`;
        const thumbKey = `${folderPath}${truncatedBaseName}-thumb.webp`;

        const mainUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${mainKey}`;
        const thumbUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${thumbKey}`;

        // Gather the file data (into memory)
                const chunks: Uint8Array[] = [];

                fileStream.on("data", (chunk) => {
                  chunks.push(chunk as Uint8Array);
                });

        fileStream.on("end", async () => {
          // Store this file's data for later processing
          const fileBuffer = Buffer.concat(chunks);
          pendingImages.push({
            truncatedBaseName,
            fileBuffer,
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

      // All fields/files have been processed
      busboy.on("finish", async () => {
        // At this point, we have data for all uploaded files
        try {
          // 1) Convert & Upload all images
          //    We'll keep track of successfully uploaded S3 keys for possible rollback
          const uploadedKeys: string[] = [];

          for (const item of pendingImages) {
            const { fileBuffer, mainKey, thumbKey } = item;

            // Convert to main WebP
            const mainWebpBuffer = await sharp(fileBuffer)
              .webp({ quality: 80 })
              .toBuffer();

            // Thumbnail WebP
            const thumbWebpBuffer = await sharp(fileBuffer)
              .resize(400)
              .webp({ quality: 80 })
              .toBuffer();

            // Upload main
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
            uploadedKeys.push(mainKey);

            // Upload thumb
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
            uploadedKeys.push(thumbKey);
          }

          // 2) If all uploads succeeded, insert DB docs
          const artworksToInsert: ArtworkDocument[] = pendingImages.map(
            (item) => {
              return new Artwork({
                name: item.truncatedBaseName,
                src: item.mainUrl,
                alt: item.truncatedBaseName,
                thumbSrc: item.thumbUrl,
              });
            }
          );

          await Artwork.insertMany(artworksToInsert);

          // 3) If DB insert succeeded, we’re done
          resolve(
            NextResponse.json(
              { message: "Files uploaded and converted successfully" },
              { status: 200 }
            )
          );
        } catch (error: any) {
          console.error("Error in upload or DB insert:", error);

          // If the DB fails or any image upload fails in the process,
          // we can do a rollback for any images that were uploaded.

          // Because we do the uploading in a loop, we only keep track of
          // keys that actually succeeded. We delete those from S3 now.
          if (error.name === "ValidationError") {
            // Possibly a Mongoose validation error
            await rollbackS3Uploads(pendingImages);
            reject(
              NextResponse.json(
                { message: "Validation Error", errors: error.errors },
                { status: 400 }
              )
            );
          } else {
            await rollbackS3Uploads(pendingImages);
            reject(
              NextResponse.json(
                { message: "Error uploading files or saving to DB" },
                { status: 500 }
              )
            );
          }
        }
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

      // If no body, reject
      if (!request.body) {
        reject(
          NextResponse.json({ error: "No request body" }, { status: 400 })
        );
        return;
      }

      // Pipe the incoming request stream into Busboy
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

/**
 * Utility function to delete the images we just uploaded if something fails
 */
async function rollbackS3Uploads(pendingImages: PendingImageData[]) {
  for (const item of pendingImages) {
    try {
      // main
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: item.mainKey,
        })
      );
      // thumb
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: item.thumbKey,
        })
      );
    } catch (err) {
      console.error("Rollback delete error:", err);
      // Not much else to do if rollback fails
    }
  }
}
