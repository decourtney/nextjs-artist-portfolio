import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {}
