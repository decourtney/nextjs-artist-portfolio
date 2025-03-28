import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { Tag } from "@/models";
import { EditableArtwork } from "@/app/dashboard/_components/FileList";
import { SanitizeAndShortenFilename } from "@/utils/sanitizeAndShortenFilename";

// Create S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    // const req = await request.json();

    const artwork = await Artwork.find({ id });
    return NextResponse.json({ artwork });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Find the artwork document by ID
    const artwork = (await Artwork.findById(id)) as ArtworkDocument;
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
    // Expected keys: name, description, size, medium, categories (array of category names), etc.
    const updatedFields: EditableArtwork = await request.json();

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
    const sanitizedUpdatedName: string = SanitizeAndShortenFilename(updatedFields.name);

    if (
      sanitizedUpdatedName &&
      sanitizedUpdatedName !== artwork.name.toLowerCase()
    ) {
      updatedFields.name = sanitizedUpdatedName

      const newMainKey = `${folderPath}${updatedFields.name}.webp`;
      const newThumbKey = `${folderPath}${updatedFields.name}-thumb.webp`;

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

    // --- Update Tag Collection ---
    // Assume updatedFields.categories is an array of category labels.
    const updatedCategoryLabels: string[] = updatedFields.categories || [];
    const updatedMediumLabel: string = updatedFields.medium;
    const updatedSizeLabel: string = updatedFields.size;

    if (updatedMediumLabel) {
      const sanitizedMediumLabel = updatedMediumLabel.replaceAll(" ", "-");
      const mediumExists = await Tag.findOne({
        label: sanitizedMediumLabel,
        type: "medium",
      });

      if (!mediumExists) {
        const newMediumTag = await Tag.create({
          label: sanitizedMediumLabel,
          type: "medium",
        });

        updatedFields.medium = newMediumTag._id;
      } else {
        updatedFields.medium = mediumExists._id;
      }
    }

    if (updatedSizeLabel) {
      const sanitizedSizeLabel = updatedSizeLabel.replaceAll(" ", "-");
      const sizeExists = await Tag.findOne({
        label: sanitizedSizeLabel,
        type: "size",
      });

      if (!sizeExists) {
        const newSizeTag = await Tag.create({
          label: sanitizedSizeLabel,
          type: "size",
        });

        updatedFields.size = newSizeTag._id;
      } else {
        updatedFields.size = sizeExists._id;
      }
    }

    // For each category in the update, ensure it exists in the Tag collection.
    const sanitizedCategoryLabels: string[] = updatedCategoryLabels.map(
      (label) => {
        return label.replaceAll(" ", "-");
      }
    );
    for (const categoryLabel of sanitizedCategoryLabels) {
      const exists = await Tag.findOne({
        label: categoryLabel,
        type: "category",
      });

      if (!exists) {
        await Tag.create({ label: categoryLabel, type: "category" });
      }
    }

    // Update the artwork's categories:
    // Find all Tag documents (of type "category") whose labels are in the updated list.
    const updatedTags = await Tag.find({
      label: { $in: sanitizedCategoryLabels },
      type: "category",
    });

    // Update the artwork's categories field to only include the Tag IDs from the updated list.
    artwork.categories = updatedTags.map((tag) => tag._id);

    // --- Update the Artwork Document ---
    artwork.name = updatedFields.name || artwork.name;
    artwork.description = updatedFields.description || artwork.description;
    artwork.size = updatedFields.size || artwork.size;
    artwork.medium = updatedFields.medium || artwork.medium;
    artwork.src = newSrc;
    artwork.thumbSrc = newThumbSrc;

    await artwork.save();

    return NextResponse.json({ message: "Artwork updated successfully" });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
