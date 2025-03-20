import NextAuth, { NextAuthOptions } from "next-auth";
import { _nextAuthOptions } from "@/auth";

const handler = NextAuth(_nextAuthOptions);

export { handler as GET, handler as POST };
