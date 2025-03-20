import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Custom field
      role: string; // Custom field
      username?: string | null; // Default NextAuth field
      email?: string | null; // Default NextAuth field
      image?: string | null; // Default NextAuth field
    };
  }

  interface User {
    id: string; // Custom field
    role: string; // Custom field
    username?: string | null; // Default NextAuth field
    email?: string | null; // Default NextAuth field
    image?: string | null; // Default NextAuth field
  }
}
