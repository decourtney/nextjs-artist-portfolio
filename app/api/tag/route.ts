import dbConnect from "@/lib/dbConnect";
import { Tag } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const tags = await Tag.find();
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(_nextAuthOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { label, type, description } = await request.json();

    // Validate required fields
    if (!label || !type) {
      return NextResponse.json(
        { message: "Label and type are required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existingTag = await Tag.findOne({ label, type });
    if (existingTag) {
      return NextResponse.json(
        { message: "Tag already exists" },
        { status: 409 }
      );
    }

    // Create new tag
    const newTag = await Tag.create({ label, type, description });
    return NextResponse.json({ tag: newTag }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(_nextAuthOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Check if tag is in use by any artwork
    const tag = await Tag.findById(id);
    if (!tag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    await tag.deleteOne();
    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
