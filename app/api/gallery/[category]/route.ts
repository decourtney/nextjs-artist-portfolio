import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: { params: { category: string } }
) => {
  const category = ctx.params.category;
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10) ;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10);

  const adjustedLimit = limit + 1;

  try {
    // Fetch all artworks in the category, sorted by a field (e.g., name)
    const artworks: ArtworkDocument[] = await Artwork.find(
      category === "all" ? {} : { category }
    )
      .skip(offset)
      .limit(adjustedLimit)
      .sort({ name: 1 }); // Adjust the sort field as needed

    // Determine if there are more documents
    const hasMore = artworks.length === adjustedLimit;
    if(hasMore){
      artworks.pop();
    }

    console.log(artworks, hasMore)
    return NextResponse.json({ artworks, hasMore });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
