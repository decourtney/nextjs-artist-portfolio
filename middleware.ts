import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token) {
    // Redirect to sign in if no token
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url, 302);
  }

  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

  // Restrict dashboard routes to admins only
  if (isDashboardRoute && token.role === "user") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"],
};
