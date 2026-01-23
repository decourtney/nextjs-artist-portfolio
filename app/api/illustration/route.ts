import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";
import dbConnect from "@/lib/dbConnect";

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

  console.log(request.body)
  await dbConnect();

 

}
