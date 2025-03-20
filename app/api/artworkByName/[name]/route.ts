import dbConnect from "@/lib/dbConnect";
import { Artwork } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await dbConnect();
    const { name } = await params;

    const artwork = await Artwork.findOne({ name })
      .populate("categories")
      .populate("medium")
      .populate("size");

    return NextResponse.json({ artwork });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
