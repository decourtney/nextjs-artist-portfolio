import Link from "next/link";
import React from "react";
import SectionSeparator from "./SectionSeparator";

const Header = () => {
  return (
    <header
      className={`relative flex flex-col items-center justify-end h-[350px]
    
      `}
    >
      <div className="max-w-4xl w-full px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-[#1e293b] font-charm mb-6 text-center">
          Gena Courtney
        </h1>
        <div className="relative flex justify-center items-center mb-8">
          <p className="text-md bg-inherit text-[#64748b]">Artist</p>
        </div>

        <nav className="relative mt-8 pb-4 w-full h-[64px] content-end">
          <ul className="flex justify-center gap-12">
            <li>
              <Link
                href="/"
                className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <SectionSeparator />
    </header>
  );
};

export default Header;
