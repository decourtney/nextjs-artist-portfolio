import React from "react";
import Link from "next/link";
import HashNavButton from "./HashNavButton";
import SignoutButton from "./SignoutButton";

const DashNav = () => {
  const hashPaths = ["file-management", "tag-management", "file-upload"];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Brand/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 mr-8">Dashboard</h1>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-2">
              {hashPaths.map((path) => (
                <HashNavButton key={path} params={path} />
              ))}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View Site
            </Link>

            <SignoutButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex space-x-2 overflow-x-auto">
          {hashPaths.map((path) => (
            <HashNavButton key={path} params={path} />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DashNav;
