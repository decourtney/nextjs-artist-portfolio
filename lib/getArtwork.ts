'use server'

import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

const getArtwork = async (offset: number, limit?: number) => {
  // console.log("getArtwork", offset, limit);
  try {
    const res = await fetch(`http://localhost:3000/api/artwork?offset=${offset}&limit=${limit}`);

    return res.json();
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export default getArtwork;
