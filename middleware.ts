import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token) {
    // Redirect to the sign-in page if not authenticated
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url, 302);
  }

  // Example: Restrict access based on roles
  const isDeleteAccountRoute = req.nextUrl.pathname.startsWith(
    "/dashboard"
  );

  // if (isDeleteAccountRoute && token.role !== "admin") {
  //   return NextResponse.json(
  //     { error: "Forbidden: Admins only" },
  //     { status: 403 }
  //   );
  // }

  return NextResponse.next();
}

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard"],
};
