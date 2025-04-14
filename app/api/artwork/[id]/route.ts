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

type S3dbUpdateData = {
  newName: string;
  s3FolderPath: string;
  s3Bucket: string;
  s3url: string;
  currentName: string;
  currentSrc: string;
  currentThumbSrc: string;
};

type CurrentArtworkData = {
  name: string;
  description?: string;
  size?: string;
  medium?: string;
  category?: string;
  price: number;
  isAvailable: boolean;
  isMainImage: boolean;
  isFeatured: boolean;
  isCategoryImage: boolean;
  src: string;
  thumbSrc: string;
};

// Some resilience logic to handle S3 errors and rollback if necessary
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
    const newArtworkData: EditableArtwork = await request.json();
    if (!newArtworkData) {
      return NextResponse.json(
        { message: "No updated fields provided" },
        { status: 400 }
      );
    }

    // Retrieve the artwork document by ID
    const artwork = (await Artwork.findById(id)) as PopulatedArtworkDocument;
    if (!artwork) {
      return NextResponse.json(
        { message: "Artwork not found" },
        { status: 404 }
      );
    }

    // S3 details
    const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!;
    const region = process.env.NEXT_PUBLIC_AWS_REGION!;
    const folderPath = process.env.NEXT_PUBLIC_AWS_IMAGES_FOLDER || "";
    const urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/`;

    const currentArtworkData: CurrentArtworkData = {
      name: artwork.name,
      description: artwork.description,
      size: artwork.size?.label,
      medium: artwork.medium?.label,
      category: artwork.category?.label,
      price: artwork.price,
      isAvailable: artwork.isAvailable,
      isMainImage: artwork.isMainImage,
      isFeatured: artwork.isFeatured,
      isCategoryImage: artwork.isCategoryImage,
      src: artwork.src,
      thumbSrc: artwork.thumbSrc,
    };

    const { category, medium, size, ...restData } = newArtworkData;

    const [categoryTag, sizeTag, mediumTag] = await Promise.all([
      category ? Tag.findOne({ label: category, type: "category" }) : null,
      size ? Tag.findOne({ label: size, type: "size" }) : null,
      medium ? Tag.findOne({ label: medium, type: "medium" }) : null,
    ]);

    Object.assign(artwork, {
      ...restData,
      ...(categoryTag && { category: categoryTag._id }),
      ...(sizeTag && { size: sizeTag._id }),
      ...(mediumTag && { medium: mediumTag._id }),
    });

    // if (category && !categoryTag) throw new Error("Invalid category name");

    if (newArtworkData.name !== currentArtworkData.name) {
      const s3UpdateResult = await updateS3({
        newName: newArtworkData.name,
        s3FolderPath: folderPath,
        s3Bucket: bucket,
        s3url: urlPrefix,
        currentName: currentArtworkData.name,
        currentSrc: currentArtworkData.src,
        currentThumbSrc: currentArtworkData.thumbSrc,
      });

      // Update artwork with the S3 update results
      artwork.src = s3UpdateResult.src;
      artwork.thumbSrc = s3UpdateResult.thumbSrc;
      artwork.name = s3UpdateResult.name;
    }

    const updatedArtwork = await artwork.save();
    return NextResponse.json({ message: "Artwork updated successfully" });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

async function updateS3(
  s3Data: S3dbUpdateData
): Promise<{ src: string; thumbSrc: string; name: string }> {
  const sanitizedName = SanitizeAndShortenString(s3Data.newName); // Sanitize and shorten the name for S3 key
  const newMainKey = `${s3Data.s3FolderPath}${sanitizedName}.webp`;
  const newThumbKey = `${s3Data.s3FolderPath}thumbnails/${sanitizedName}-thumb.webp`;
  const oldMainKey = s3Data.currentSrc.replace(s3Data.s3url, "");
  const oldThumbKey = s3Data.currentThumbSrc.replace(s3Data.s3url, "");

  try {
    // Create a copy of the image and thumbnail with the new key then delete the old images
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: s3Data.s3Bucket,
        CopySource: `${s3Data.s3Bucket}/${oldMainKey}`,
        Key: newMainKey,
      })
    );
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3Data.s3Bucket,
        Key: oldMainKey,
      })
    );

    await s3Client.send(
      new CopyObjectCommand({
        Bucket: s3Data.s3Bucket,
        CopySource: `${s3Data.s3Bucket}/${oldThumbKey}`,
        Key: newThumbKey,
      })
    );
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3Data.s3Bucket,
        Key: oldThumbKey,
      })
    );

    return {
      src: `${s3Data.s3url}${newThumbKey}`,
      thumbSrc: `${s3Data.s3url}${newMainKey}`,
      name: s3Data.newName,
    };
  } catch (error) {
    console.log("Error during S3 copy/delete:", error);
    // return old name so doc and file stay sync
    return {
      src: s3Data.currentSrc,
      thumbSrc: s3Data.currentThumbSrc,
      name: s3Data.currentName,
    };
  }
}
