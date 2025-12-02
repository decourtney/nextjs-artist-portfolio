"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";

const SignoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
    >
      <IoLogOutOutline size={18} />
      <span>Logout</span>
    </button>
  );
};

export default SignoutButton;
