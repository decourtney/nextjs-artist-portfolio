import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import dbConnect from "@/lib/dbConnect";
import Artwork, { IArtwork, PopulatedArtworkDocument } from "@/models/Artwork";
import { Tag } from "@/models";
import { SanitizeAndShortenString } from "@/utils/sanitizeAndShortenString";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";
import { EditFormData } from "@/types/editFormData";
import Illustration from "@/models/Illustration";
import { s3Client } from "@/lib/s3Client";

// Create S3 client
// const s3Client = new S3Client({
//   region: process.env.NEXT_PUBLIC_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check if user is admin
    const session = await getServerSession(_nextAuthOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    await dbConnect();
    const { id } = await params;

    // Find the artwork document by ID
    const artwork = (await Artwork.findById(id)) as IArtwork;
    if (!artwork) {
      return NextResponse.json(
        { message: "Artwork not found" },
        { status: 404 },
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
      }),
    );

    // Delete the thumbnail from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: thumbKey,
      }),
    );

    // Remove the artwork document from the database
    await artwork.deleteOne();

    return NextResponse.json(
      { message: "Artwork deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Some resilience logic to handle S3 errors and rollback if necessary
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check if user is admin
    const session = await getServerSession(_nextAuthOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    await dbConnect();
    const { id } = await params;

    // Parse the incoming JSON payload containing the updated artwork fields.
    // Expected keys: name, description, size, medium, categories (array of category names), etc.
    const newArtworkData: EditFormData = await request.json();
    if (!newArtworkData) {
      return NextResponse.json(
        { message: "No updated fields provided" },
        { status: 400 },
      );
    }

    // Retrieve the artwork document by ID
    const artwork = (await Artwork.findById(id)
      .maxTimeMS(10000)
      .populate(["substance", "size", "medium", "category"])
      .exec()) as PopulatedArtworkDocument;

    if (!artwork) {
      return NextResponse.json(
        { message: "Artwork not found" },
        { status: 404 },
      );
    }

    // Maintain current artwork document data for rollback if necessary
    // Current not being used
    // const oldArtworkData = artwork;

    // Deconstruct new data
    const { category, medium, size, substance, ...restData } = newArtworkData;

    // Swap tag name for id
    const [categoryTag, sizeTag, mediumTag, substanceTag] = await Promise.all([
      category
        ? Tag.findOne({ label: category, type: "category" })
            .maxTimeMS(10000)
            .exec()
        : null,
      size
        ? Tag.findOne({ label: size, type: "size" }).maxTimeMS(10000).exec()
        : null,
      medium
        ? Tag.findOne({ label: medium, type: "medium" }).maxTimeMS(10000).exec()
        : null,
      substance
        ? Tag.findOne({ label: substance, type: "substance" })
            .maxTimeMS(10000)
            .exec()
        : null,
    ]);

    if (artwork.isIllustration !== newArtworkData.isIllustration)
      await updateIllustration(artwork._id, newArtworkData.isIllustration);

    // Assign new data to existing artwork document
    Object.assign(artwork, {
      ...restData,
      ...(categoryTag && { category: categoryTag._id }),
      ...(sizeTag && { size: sizeTag._id }),
      ...(mediumTag && { medium: mediumTag._id }),
      ...(substanceTag && { substance: substanceTag._id }),
    });

    // S3 details
    const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!;
    const region = process.env.NEXT_PUBLIC_AWS_REGION!;
    const folderPath = process.env.NEXT_PUBLIC_AWS_IMAGES_FOLDER || "";
    const urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/`;

    // If the name has changed then we need to update the s3
    if (newArtworkData.name !== artwork.name) {
      const s3UpdateResult = await updateS3({
        newName: newArtworkData.name,
        s3FolderPath: folderPath,
        s3Bucket: bucket,
        s3url: urlPrefix,
        currentName: artwork.name,
        currentSrc: artwork.src,
        currentThumbSrc: artwork.thumbSrc,
      });

      // Update artwork document with the S3 update results
      artwork.src = s3UpdateResult.src;
      artwork.thumbSrc = s3UpdateResult.thumbSrc;
      artwork.name = s3UpdateResult.name;
    }

    // Save and return updated artwork document
    const updatedArtwork = await artwork.save();
    // const updatedArtwork = await savedDoc.populate([
    //   "substance",
    //   "size",
    //   "medium",
    //   "category",
    // ]);

    console.log(updatedArtwork);
    return NextResponse.json(updatedArtwork, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

async function updateIllustration(id: string, boolValue: boolean) {
  if (boolValue) {
    await Illustration.updateOne(
      { name: "Unassigned" },
      { $addToSet: { artworkIds: id } },
    );
  } else {
    await Illustration.updateMany(
      { artworkIds: id },
      { $pull: { artworkIds: id } },
    );
  }
}

async function updateS3(updateData: {
  newName: string;
  s3FolderPath: string;
  s3Bucket: string;
  s3url: string;
  currentName: string;
  currentSrc: string;
  currentThumbSrc: string;
}): Promise<{ src: string; thumbSrc: string; name: string }> {
  const sanitizedName = SanitizeAndShortenString(updateData.newName); // Sanitize and shorten the name for S3 key
  const newMainKey = `${updateData.s3FolderPath}${sanitizedName}.webp`;
  const newThumbKey = `${updateData.s3FolderPath}thumbnails/${sanitizedName}-thumb.webp`;
  const oldMainKey = updateData.currentSrc.replace(updateData.s3url, "");
  const oldThumbKey = updateData.currentThumbSrc.replace(updateData.s3url, "");

  try {
    // Create a copy of the image and thumbnail with the new key then delete the old images
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: updateData.s3Bucket,
        CopySource: `${updateData.s3Bucket}/${oldMainKey}`,
        Key: newMainKey,
      }),
    );
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: updateData.s3Bucket,
        Key: oldMainKey,
      }),
    );

    await s3Client.send(
      new CopyObjectCommand({
        Bucket: updateData.s3Bucket,
        CopySource: `${updateData.s3Bucket}/${oldThumbKey}`,
        Key: newThumbKey,
      }),
    );
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: updateData.s3Bucket,
        Key: oldThumbKey,
      }),
    );

    return {
      src: `${updateData.s3url}${newThumbKey}`,
      thumbSrc: `${updateData.s3url}${newMainKey}`,
      name: updateData.newName,
    };
  } catch (error) {
    console.log("Error during S3 copy/delete:", error);
    // return old name so doc and file stay sync
    return {
      src: updateData.currentSrc,
      thumbSrc: updateData.currentThumbSrc,
      name: updateData.currentName,
    };
  }
}
