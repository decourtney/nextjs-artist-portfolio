// TODO - need to look a little deeper into import server components into client components
"use server";

import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

export const getCategoryArtwork = async (category: string, limit: string, offset?: string) => {
  // console.log("getCategoryArtwork", offset, limit);
  try {
    const res = await fetch(
      `http://localhost:3000/api/gallery/${category}?offset=${offset}&limit=${limit}`
    );

    return res.json();
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};


export const getCarouselArtwork = async (category: string, artworkName: string) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/gallery/${category}`
    );
    const data = await res.json();
    const artworks: ArtworkDocument[] = data.artwork;
    const initialArtwork = artworks.filter((artwork) => artwork.name === artworkName);

    return initialArtwork;
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}