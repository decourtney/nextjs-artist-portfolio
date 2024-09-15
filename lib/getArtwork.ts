'use server'

import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

const getArtwork = async (offset: number, limit: number = 10) => {
  try {
    const res = await fetch(`http://localhost:3000/api/artwork?offset=${offset}&limit=${limit}`);
    // console.log(res.json());
    // const data: ArtworkDocument[] = await res.json();

    // console.log(res.body);
    return res.json();
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
};

export default getArtwork;
