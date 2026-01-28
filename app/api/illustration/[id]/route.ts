import { _nextAuthOptions } from "@/auth";
import Illustration, { IIllustration } from "@/models/Illustration";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check if user is admin
  const session = await getServerSession(_nextAuthOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized: Admin access required" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { name, artworkIds } = body;

  if (!name) {
    return NextResponse.json(
      { message: "Illustration name is required" },
      { status: 400 }
    );
  }
  try {
    const updated: IIllustration | null = await Illustration.findOneAndUpdate(
      { _id: id },
      { $set: { name, artworkIds } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Illustration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: updated._id.toString(),
        name: updated.name,
        artworkIds: updated.artworkIds.map((id) => id.toString()),
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(_nextAuthOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized: Admin access required" },
      { status: 403 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Illustration ID is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await Illustration.deleteOne({ _id: id });

    if (updated.deletedCount === 0) {
      return NextResponse.json(
        { message: "Illustration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { id, message: "Illustration deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to delete illustration:", err);
    return NextResponse.json(
      { message: "Failed to delete illustration" },
      { status: 500 }
    );
  }
}
