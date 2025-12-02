"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const OAuthButtons = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-lg bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
      >
        <FaGoogle className="text-foreground-500" />
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-200 group"
      >
        <FaGithub className="text-foreground-500" />
        <span className="text-white font-medium">Continue with GitHub</span>
      </button>
    </div>
  );
};

export default OAuthButtons;
