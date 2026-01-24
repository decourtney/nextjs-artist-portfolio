import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Illustration, { IIllustration } from "@/models/Illustration";

export async function GET() {}

export async function POST(request: NextRequest) {
  // Check if user is admin
  const session = await getServerSession(_nextAuthOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized: Admin access required" },
      { status: 403 }
    );
  }

  await dbConnect();

  const body = await request.json();
  const { name, artworkIds } = body;

  if (!name) {
    return NextResponse.json(
      { message: "Illustration name is required" },
      { status: 400 }
    );
  }

  try {
    const illustration: IIllustration = await Illustration.create({
      name,
      artwork: artworkIds ?? [],
    });

    return NextResponse.json(
      {
        id: illustration._id.toString(),
        name: illustration.name,
        artworkIds: illustration.artwork.map((id) => id.toString()),
      },
      { status: 201 }
    );
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as any).code === 11000
    ) {
      return NextResponse.json(
        { message: "An Illustration with this name already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
