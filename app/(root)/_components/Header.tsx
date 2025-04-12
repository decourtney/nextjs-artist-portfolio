"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Header = () => {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const isGalleryCategory = pathname.startsWith("/gallery/");

  useEffect(() => {
    if (headerRef.current) {
      gsap.to(headerRef.current, {
        height: isGalleryCategory ? "64px" : "350px", // Dramatically reduce height
        duration: 0.5,
        ease: "power4.out",
        overflow: "hidden",
      });
    }
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`relative flex flex-col items-center justify-end transition-all duration-500 ease-in-out
        ${isGalleryCategory ? "h-[64px]" : "h-[350px]"}
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
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
    </header>
  );
};

export default Header;
