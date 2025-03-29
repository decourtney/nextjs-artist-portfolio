import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import { Profile } from "@/models";

export const _nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT sessions
  },
  callbacks: {
    async signIn({ user }) {
      await dbConnect();
      const existingProfile = await Profile.findOne({ authId: user.id });
      if (!existingProfile) {
        // If not found, block sign-in
        return false;
      }
      return true; // If found, allow sign-in
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        // user.id is our "authId", but ensure you do the correct lookup for your model
        await dbConnect();
        const existingProfile = await Profile.findOne({ authId: user.id });
        if (existingProfile) {
          // Attach the role to the token
          token.role = existingProfile.role;
        } else {
          // Default to user role if not found
          token.role = "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        // Attach the role to the session
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  events: {
    signIn: async ({ user }) => {
      if (!user || !user.id) return;
      await dbConnect();

      const authId = user.id as string;
      const existingProfile = await Profile.findOne({ authId });
      if (!existingProfile) {
        const newProfile = new Profile({
          username:
            user.name?.replace(/\s+/g, "").toLowerCase() || `user${Date.now()}`,
          role: "user", // db defaults to 'user' if not provided
          avatar: user.image || "/default-avatar.png",
          authId,
        });
        await newProfile.save();
      }
    },
    signOut: async ({ session, token }) => {},
  },
  pages: {
    // signIn: "/signin", // Custom sign-in page
    // error: "/auth/error", // Custom error page
  },
  logger: {
    error: (code, metadata) => {
      console.error("NextAuth Error:", code, metadata);
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this set
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, _nextAuthOptions);
}
