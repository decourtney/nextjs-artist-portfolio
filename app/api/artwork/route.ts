import dbConnect from "@/lib/dbConnect";
import Artwork from "@/models/Artwork";
import { NextResponse } from "next/server";

export const GET = async () => {
  console.log("GET /api/artwork");

  try {
    const art = await Artwork.find({});

    console.log(art)
    return NextResponse.json(art);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
