import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: { params: { category: string; artwork: string } } // Changed ArtworkDocument to string
) => {
  const category = ctx.params.category || "all";
  const name = decodeURIComponent(ctx.params.artwork); // Decode the artwork name

  try {
    // Fetch all artworks in the category, sorted by a field (e.g., name)
    const artworks: ArtworkDocument[] = await Artwork.find(
      category === "all" ? {} : { category }
    ).sort({ name: 1 }); // Adjust the sort field as needed

    // Find the index of the requested artwork
    const index = artworks.findIndex((art) => art.name === name);

    if (index === -1) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    const artwork = artworks[index];
    const prevArtworkName = index > 0 ? (artworks[index - 1]).name : null;
    const nextArtworkName =
      index < artworks.length - 1 ? (artworks[index + 1]).name : null;

    return NextResponse.json({ artwork, prevArtworkName, nextArtworkName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
