import Artwork from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: { params: { category: string } }
) => {
  const category = ctx.params.category;
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10);

  try {
    const query = category === "all" ? {} : { category };

    const artwork = await Artwork.find(query).skip(offset).limit(limit);

    // Determine if there are more documents
    const hasMore = artwork.length === limit;

    return NextResponse.json({ artwork, hasMore });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
