import Artwork from "@/models/Artwork";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: { params: { category: string } }
) => {
  const {} = new URL(req.url);
  console.log("--SEARCHPARAMS--", ctx.params.category);

  try {
    const artwork = await Artwork.find({ where: { category: "painting" } });

    return NextResponse.json({ artwork });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
