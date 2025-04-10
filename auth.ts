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
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/mongoDBAdapter";

export const _nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT sessions
    maxAge: 60 * 60 * 24, // 24 hours, or set your desired session expiration
    updateAge: 60 * 60, // How often to refresh the session
  },
  jwt: {
    maxAge: 60 * 60 * 24, // 24 hours for JWT expiration
  },
  pages: {
    // signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true;
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.expires = token.exp as string;
        // Attach the role to the session
        (session.user as any).role = token.role;
      }
      return session;
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
          token.role = "guest";
        }
      }
      return token;
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
  logger: {
    error: (code, metadata) => {
      console.error("NextAuth Error:", code, metadata);
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, _nextAuthOptions);
}
