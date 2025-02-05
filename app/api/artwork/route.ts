import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  CompleteMultipartUploadCommandOutput,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import Busboy from "busboy";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { Readable } from "stream";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper: Convert Next.js ReadableStream to Node.js Readable stream
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

// GET: Retrieve all artworks
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

// POST: Handle file uploads via multipart/form-data
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log("Request body:", request.body);
    return NextResponse.json({ message: "test complete" });

    const contentType = request.headers.get("content-type");
    if (!contentType) {
      return NextResponse.json(
        { error: "Content-Type header is missing" },
        { status: 400 }
      );
    }

    // Initialize Busboy for multipart parsing
    const busboy = Busboy({ headers: { "content-type": contentType } });
    const fileUploadPromises: Promise<CompleteMultipartUploadCommandOutput>[] =
      [];
    const artworks: ArtworkDocument[] = [];
    const formFields: Record<string, string> = {};
    let fileIndex = 0;

    // Wrap Busboy processing in a Promise so that we can await its completion
    // return new Promise<NextResponse>((resolve, reject) => {
    //   // Capture form fields
    //   busboy.on("field", (fieldname, value) => {
    //     formFields[fieldname] = value;
    //   });

    //   // Handle file uploads
    //   busboy.on("file", (fieldname, fileStream, info) => {
    //     const { filename, mimeType } = info;
    //     const folderPath = process.env.NEXT_PUBLIC_AWS_BUCKET_FOLDER || "";

    //     // Extract the file extension (if any) from the original filename
    //     const extensionIndex = filename.lastIndexOf(".");
    //     const extension =
    //       extensionIndex !== -1 ? filename.substring(extensionIndex) : "";

    //     // Extract the base name (without the extension)
    //     const baseName =
    //       extensionIndex !== -1
    //         ? filename.substring(0, extensionIndex)
    //         : filename;

    //     // Truncate the base name to no more than 60 characters
    //     const truncatedBaseName =
    //       baseName.length > 60 ? baseName.substring(0, 60) : baseName;

    //     // Build the final file name using the truncated base name and the original extension
    //     const finalFileName = truncatedBaseName + extension;
    //     const fullKey = folderPath + finalFileName;

    //     // Construct the file URL for S3
    //     const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fullKey}`;

    //     // (Optional) Extract additional metadata for your Artwork document as needed
    //     const name = formFields[`name_${fileIndex}`];
    //     const description = formFields[`description_${fileIndex}`];
    //     const alt = formFields[`alt_${fileIndex}`];

    //     // Create a new Artwork document (or any appropriate document)
    //     const artwork = new Artwork({
    //       name,
    //       description,
    //       src: fileUrl,
    //       alt,
    //     });
    //     artworks.push(artwork);

    //     // Initiate file upload to S3 using the AWS SDK's Upload helper
    //     const upload = new Upload({
    //       client: s3Client,
    //       params: {
    //         Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
    //         Key: fullKey,
    //         Body: fileStream,
    //         ContentType: mimeType,
    //       },
    //     });

    //     fileUploadPromises.push(upload.done());
    //     fileIndex++;
    //   });


    //   // When Busboy finishes parsing
    //   busboy.on("finish", async () => {
    //     try {
    //       // Ensure all files have been uploaded to S3
    //       await Promise.all(fileUploadPromises);
    //       // Insert all Artwork documents into MongoDB
    //       await Artwork.insertMany(artworks);
    //       resolve(
    //         NextResponse.json(
    //           { message: "Files uploaded and saved successfully" },
    //           { status: 200 }
    //         )
    //       );
    //     } catch (error: any) {
    //       console.error("Error uploading files:", error);
    //       if (error.name === "ValidationError") {
    //         reject(
    //           NextResponse.json(
    //             { message: "Validation Error", errors: error.errors },
    //             { status: 400 }
    //           )
    //         );
    //       } else {
    //         reject(
    //           NextResponse.json(
    //             { message: "Error uploading files" },
    //             { status: 500 }
    //           )
    //         );
    //       }
    //     }
    //   });

    //   busboy.on("error", (error) => {
    //     console.error("Busboy error:", error);
    //     reject(
    //       NextResponse.json(
    //         { message: "Error parsing form data" },
    //         { status: 500 }
    //       )
    //     );
    //   });

    //   // Ensure the request has a body to read
    //   if (!request.body) {
    //     reject(
    //       NextResponse.json({ error: "No request body" }, { status: 400 })
    //     );
    //     return;
    //   }

    //   // Convert the Next.js ReadableStream to a Node.js Readable and pipe it to Busboy
    //   const reader = request.body.getReader();
    //   const stream = new ReadableStream({
    //     async pull(controller) {
    //       const { done, value } = await reader.read();
    //       if (done) {
    //         controller.close();
    //       } else {
    //         controller.enqueue(value);
    //       }
    //     },
    //   });
    //   const nodeStream = streamToNodeReadable(stream);
    //   nodeStream.pipe(busboy);
    // });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
