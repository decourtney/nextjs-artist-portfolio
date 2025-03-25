import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongoDBAdapter";
import type { Adapter } from "next-auth/adapters";
import { Profile } from "@/models";

export const _nextAuthOptions: NextAuthOptions = {
  // adapter: MongoDBAdapter(client) as Adapter,
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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Pass user ID to token
      }
      console.log("jwt:", token);
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string; // Safely attach user ID
      }
      console.log("session:", session);
      return session;
    },

    // async signIn({ user, account, profile }) {
    //   // console.log("Sign in callback:", user, account, profile);

    //   return true;
    // },
  },
  events: {
    // Perform actions after events
    signOut: async (message) => {
      // console.log("User signed out:", message);
    },
    signIn: async ({ user }) => {
      if (!user || !user.id) return;

      // console.log("Sign in event:", user);

      await dbConnect();

      const userId = user.id;

      const existingProfile = await Profile.findOne({ userId });

      if (!existingProfile) {
        const newProfile = new Profile({
          userId,
          username:
            user.name?.replace(/\s+/g, "").toLowerCase() || `user${Date.now()}`,
          avatar: user.image || "/default-avatar.png",
        });

        await newProfile.save();
        // console.log("Profile created:", newProfile);
      }
    },
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
