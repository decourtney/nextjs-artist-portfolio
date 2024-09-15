import Artwork from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const offset = parseInt(url.searchParams.get("offset") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  try {
    const artwork = await Artwork.find()
      .skip((offset - 1) * limit)
      .limit(limit);
    // .select("name thumbnailUrl");

    const total = await Artwork.countDocuments();
    const hasMore = offset * limit < total;

    return NextResponse.json({ artwork, hasMore });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
