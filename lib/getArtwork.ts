// TODO - need to look a little deeper into import server components into client components
"use server";

import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

const getArtwork = async (category: string, limit: string, offset?: string) => {
  // console.log("getArtwork", offset, limit);
  try {
    const res = await fetch(
      `http://localhost:3000/api/gallery/${category}?offset=${offset}&limit=${limit}`
    );

    return res.json();
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export default getArtwork;
