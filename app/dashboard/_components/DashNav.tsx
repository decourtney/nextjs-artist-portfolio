"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const DashNav = () => {
  const session = useSession();
  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-gray-700">{session.data?.user.email}</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Gallery
            </Link>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashNav;
