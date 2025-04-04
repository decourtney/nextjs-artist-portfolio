"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AuthStatus = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="h-8 w-8 rounded-full bg-background-200 animate-pulse" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {pathname !== "/dashboard" && (
          <Link
            href="/dashboard"
            className="text-foreground-500 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
        )}
        <button
          onClick={() => signOut()}
          className="text-foreground-500 hover:text-primary-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="text-foreground-500 hover:text-primary-500 transition-colors"
    >
      Sign In
    </button>
  );
};

export default AuthStatus;
