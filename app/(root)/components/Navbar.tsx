"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    // Set initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Logo and menu button - appear together after scroll */}
      <div
        className={`fixed top-6 left-6 z-50 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
        >
          GC
        </Link>
      </div>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <span className="sr-only">Open main menu</span>
        {!isMenuOpen ? (
          <svg
            className="block h-6 w-6 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          <svg
            className="block h-6 w-6 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 transition-all duration-500 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full justify-center items-center space-y-8">
          <Link
            href="/"
            className={`text-2xl font-bold text-gray-900 hover:text-gray-700 transition-all duration-500 ${
              isMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className={`text-2xl font-bold text-gray-900 hover:text-gray-700 transition-all duration-500 delay-100 ${
              isMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            href="/about"
            className={`text-2xl font-bold text-gray-900 hover:text-gray-700 transition-all duration-500 delay-200 ${
              isMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`text-2xl font-bold text-gray-900 hover:text-gray-700 transition-all duration-500 delay-300 ${
              isMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}
