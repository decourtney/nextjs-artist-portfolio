import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dbConnect from "@/lib/dbConnect";
import Artwork, { IArtwork } from "@/models/Artwork";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";
import { s3Client } from "@/lib/s3Client";

// Create S3 client
// const s3Client = new S3Client({
//   region: process.env.NEXT_PUBLIC_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

export async function DELETE(request: NextRequest) {
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
    const { ids } = await request.json(); // Expecting { ids: string[] }
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
    }

    // Fetch artworks to retrieve their S3 URL details
    const artworks = (await Artwork.find({ _id: { $in: ids } })
      .maxTimeMS(10000)
      .exec()) as unknown as IArtwork[];

    const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!;
    const region = process.env.NEXT_PUBLIC_AWS_REGION!;
    const urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/`;

    // Loop through each artwork and delete its main image and thumbnail from S3
    for (const artwork of artworks) {
      const mainKey = artwork.src.replace(urlPrefix, "");
      const thumbKey = artwork.thumbSrc.replace(urlPrefix, "");

      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: mainKey,
          })
        );
      } catch (err) {
        console.error(`Failed to delete main image for ${artwork._id}:`, err);
      }

      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: thumbKey,
          })
        );
      } catch (err) {
        console.error(`Failed to delete thumbnail for ${artwork._id}:`, err);
      }
    }

    // Delete the artwork documents from the database
    await Artwork.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: "Batch delete successful" });
  } catch (error) {
    console.error("Batch deletion error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
