import React from "react";
import Link from "next/link";
import HashNavButton from "./HashNavButton";
import SignoutButton from "./SignoutButton";

const DashNav = () => {
  const hashPaths = [
    "file-management",
    "tag-management",
    "file-upload",
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">


          <div className="m-4 space-x-4">
            {hashPaths.map((path) => (
              <HashNavButton params={path} />
            ))}
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex mx-4  ">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Home
              </Link>
            </div>

            <SignoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashNav;
