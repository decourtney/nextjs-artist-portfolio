"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const OAuthButtons = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="flex items-center justify-center gap-2 w-full p-3 rounded-medium bg-background-100 border border-divider-200 hover:bg-background-200 transition-colors"
      >
        <FaGoogle className="text-foreground-500" />
        <span className="text-foreground-500">Continue with Google</span>
      </button>
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="flex items-center justify-center gap-2 w-full p-3 rounded-medium bg-background-100 border border-divider-200 hover:bg-background-200 transition-colors"
      >
        <FaGithub className="text-foreground-500" />
        <span className="text-foreground-500">Continue with GitHub</span>
      </button>
    </div>
  );
};

export default OAuthButtons;
