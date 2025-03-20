import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });

  if (!token) {
    // Redirect to the sign-in page if not authenticated
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url, 302);
  }

  // Example: Restrict access based on roles
  const isDeleteAccountRoute = request.nextUrl.pathname.startsWith(
    "/api/account/delete"
  );

  console.log("token:", token);
  if (isDeleteAccountRoute && token.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

// TODO: Need to adjust protected routes for this project
export const config = {
  matcher: ["/account", "/api/account", "/dashboard"], // Adjust paths as needed
};
