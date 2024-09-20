import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: { params: { category: string; artwork: ArtworkDocument } }
) => {
  const category = ctx.params.category || "all";
  const name = ctx.params.artwork;

  try {
    const artwork = await Artwork.findOne({name: name});

    return NextResponse.json({category, artwork });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
