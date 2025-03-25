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
    async jwt({ token, user, trigger }) {
      // When a new user signs in (or token is refreshed), we can look up their role
      if (user) {
        // user.id is our "authId", but ensure you do the correct lookup for your model
        await dbConnect();
        const existingProfile = await Profile.findOne({ authId: user.id });
        if (existingProfile) {
          token.role = existingProfile.role; // <-- Store the role in the token
        } else {
          // If no existing profile, default the role (e.g. "user") or do nothing
          token.role = "user";
        }
      }

      // The `trigger === 'update'` case applies if you do token rotation –
      // you could re-check the DB on each refresh if you want.

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        // Attach the role if you want it in your session
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
          authId,
          username:
            user.name?.replace(/\s+/g, "").toLowerCase() || `user${Date.now()}`,
          avatar: user.image || "/default-avatar.png",
          // Optionally assign role here if needed
          // role: 'user'
        });
        await newProfile.save();
        console.log("Profile created:", newProfile);
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
