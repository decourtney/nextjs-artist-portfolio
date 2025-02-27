import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import dbConnect from "@/lib/dbConnect";
import Artwork from "@/models/Artwork";

// Create S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    console.log(id);
    // Find the artwork document by ID
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return NextResponse.json(
        { message: "Artwork not found" },
        { status: 404 }
      );
    }

    // Extract S3 keys from the stored URLs
    const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!;
    const region = process.env.NEXT_PUBLIC_AWS_REGION!;
    const urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/`;

    const mainKey = artwork.src.replace(urlPrefix, "");
    const thumbKey = artwork.thumbSrc.replace(urlPrefix, "");

    // Delete the main image from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: mainKey,
      })
    );

    // Delete the thumbnail from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: thumbKey,
      })
    );

    // Remove the artwork document from the database
    await artwork.deleteOne();

    return NextResponse.json(
      { message: "Artwork deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    // Parse the incoming JSON payload containing the updated artwork fields.
    // Expected keys: name, description, size, medium, categories, etc.
    const updatedFields = await request.json();

    // Retrieve the artwork document by ID
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return NextResponse.json(
        { message: "Artwork not found" },
        { status: 404 }
      );
    }

    // Setup S3 details
    const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!;
    const region = process.env.NEXT_PUBLIC_AWS_REGION!;
    const folderPath = process.env.NEXT_PUBLIC_AWS_IMAGES_FOLDER || "";
    const urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/`;

    // Determine current S3 keys based on stored URLs
    const oldMainKey = artwork.src.replace(urlPrefix, "");
    const oldThumbKey = artwork.thumbSrc.replace(urlPrefix, "");

    let newSrc = artwork.src;
    let newThumbSrc = artwork.thumbSrc;

    // If the name is being updated (and is different), handle S3 renaming
    if (updatedFields.name && updatedFields.name !== artwork.name) {
      // Truncate the new name to 60 characters if necessary
      const truncatedName =
        updatedFields.name.length > 60
          ? updatedFields.name.substring(0, 60)
          : updatedFields.name;
      const newMainKey = `${folderPath}${truncatedName}.webp`;
      const newThumbKey = `${folderPath}${truncatedName}-thumb.webp`;

      // If the main image key has changed, copy and then delete the old S3 object
      if (newMainKey !== oldMainKey) {
        await s3Client.send(
          new CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${oldMainKey}`,
            Key: newMainKey,
          })
        );
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: oldMainKey,
          })
        );
        newSrc = `https://${bucket}.s3.${region}.amazonaws.com/${newMainKey}`;
      }

      // Similarly, handle the thumbnail image
      if (newThumbKey !== oldThumbKey) {
        await s3Client.send(
          new CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${oldThumbKey}`,
            Key: newThumbKey,
          })
        );
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: oldThumbKey,
          })
        );
        newThumbSrc = `https://${bucket}.s3.${region}.amazonaws.com/${newThumbKey}`;
      }
    }

    // Update the artwork document with new values
    artwork.name = updatedFields.name || artwork.name;
    artwork.description = updatedFields.description || artwork.description;
    artwork.size = updatedFields.size || artwork.size;
    artwork.medium = updatedFields.medium || artwork.medium;
    artwork.categories = updatedFields.categories || artwork.categories;
    artwork.src = newSrc;
    artwork.thumbSrc = newThumbSrc;

    await artwork.save();

    return NextResponse.json({ message: "Artwork updated successfully" });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

