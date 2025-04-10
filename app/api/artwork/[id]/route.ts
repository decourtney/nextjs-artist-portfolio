import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { Tag } from "@/models";
import { EditableArtwork } from "@/app/dashboard/_components/FileManagement";
import { SanitizeAndShortenString } from "@/utils/sanitizeAndShortenString";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";
import { PopulatedArtworkDocument } from "@/models/Artwork";

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
    // Check if user is admin
    const session = await getServerSession(_nextAuthOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;

    // Find the artwork document by ID
    const artwork = (await Artwork.findById(id)) as PopulatedArtworkDocument;
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
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    // Parse the incoming JSON payload containing the updated artwork fields.
    // Expected keys: name, description, size, medium, categories (array of category names), etc.
    const updatedFields: EditableArtwork = await request.json();

    // Retrieve the artwork document by ID
    const artwork = (await Artwork.findById(id)) as PopulatedArtworkDocument;
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

    const oldName = artwork.name;
    const oldDescription = artwork.description;
    const oldSize = artwork.size?.label;
    const oldMedium = artwork.medium?.label;
    const oldCategory = artwork.category?.label;
    const oldPrice = artwork.price;
    const oldAvailable = artwork.available;
    const oldSrc = artwork.src;
    const oldThumbSrc = artwork.thumbSrc;

    // Determine current S3 keys based on stored URLs
    const oldMainKey = oldSrc.replace(urlPrefix, "");
    const oldThumbKey = oldThumbSrc.replace(urlPrefix, "");

    // Used to track any changes to be applied to the artwork document
    const updateData: Partial<ArtworkDocument> = {};

    // Populate updateData with changed and sanitized fields
    if (updatedFields.name && updatedFields.name !== oldName) {
      updateData.name = updatedFields.name;
    }

    if (
      updatedFields.description &&
      updatedFields.description !== oldDescription
    ) {
      updateData.description = updatedFields.description;
    }
    if (updatedFields.size && updatedFields.size !== oldSize) {
      const tag = await Tag.findOne({
        label: updatedFields.size,
        type: "size",
      });
      if (!tag) {
        return NextResponse.json(
          { message: "Size not found" },
          { status: 404 }
        );
      }
      updateData.size = tag._id;
    }
    if (updatedFields.medium && updatedFields.medium !== oldMedium) {
      console.log("MEDIUM:", updatedFields.medium, oldMedium);
      const tag = await Tag.findOne({
        label: updatedFields.medium,
        type: "medium",
      });
      if (!tag) {
        return NextResponse.json(
          { message: "Medium not found" },
          { status: 404 }
        );
      }
      updateData.medium = tag._id;
    }
    if (updatedFields.category && updatedFields.category !== oldCategory) {
      const tag = await Tag.findOne({
        label: updatedFields.category,
        type: "category",
      });
      if (!tag) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
      updateData.category = tag._id;
    }
    if (updatedFields.price && updatedFields.price !== oldPrice) {
      updateData.price = updatedFields.price;
    }
    if (updatedFields.available && updatedFields.available !== oldAvailable) {
      updateData.available = updatedFields.available;
    }

    // no fallback yet
    //
    if (updateData.name) {
      const sanitizedName = SanitizeAndShortenString(updateData.name); // Sanitize and shorten the name for S3 key
      const newMainKey = `${folderPath}${sanitizedName}.webp`;
      const newThumbKey = `${folderPath}thumbnails/${sanitizedName}-thumb.webp`;

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
        updateData.src = `${urlPrefix}${newMainKey}`;
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
        updateData.thumbSrc = `${urlPrefix}${newThumbKey}`;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await Artwork.updateOne({ _id: artwork._id }, { $set: updateData });
    }

    return NextResponse.json({ message: "Artwork updated successfully" });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

async function performAtomicUpdate(
  id: string,
  updatedFields: EditableArtwork,
  originalArtwork: PopulatedArtworkDocument,
  orignalS3Keys: { mainKey: string; thumbKey: string }
) {
  try {
  } catch (atomicUpdateError) {
    console.log("Atomic update error:", atomicUpdateError);
  }
}

async function rollbackUpdate(
  originalArtwork: PopulatedArtworkDocument,
  originalS3Keys: { mainKey: string; thumbKey: string }
) {
  try {
  } catch (rollbackError) {
    console.log("Rollback error:", rollbackError);
  }
}
