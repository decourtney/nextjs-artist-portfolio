"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Floating Menu Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isScrolled ? 1 : 0,
          y: isScrolled ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full border-2 border-transparent hover:border-[#3b82f6] focus:border-[#3b82f6] transition-colors ${
          isScrolled ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{}}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <div className="w-4 h-4 flex flex-col justify-between">
          <span
            className={`block w-full h-0.5 bg-[#3b82f6] transition-transform duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-full h-0.5 bg-[#3b82f6] transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-full h-0.5 bg-[#3b82f6] transition-transform duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </div>
      </motion.button>

      {/* Floating Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-6 z-40 bg-[#e2e8f0] rounded-2xl shadow-xl p-6"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`group relative text-lg font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? "text-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      animate={{ width: pathname === item.href ? "100%" : 0 }}
                    />
                    <motion.span
                      className="absolute -bottom-1 left-0 w-2 h-2 rounded-full bg-black opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: pathname === item.href ? 1 : 0 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Link - Always visible */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isScrolled ? 1 : 0,
          y: isScrolled ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-6 left-6 z-50 ${
          isScrolled ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <Link
          href="/"
          className="text-xl font-medium text-black hover:text-gray-600 transition-colors"
        >
          GC
        </Link>
      </motion.div>
    </>
  );
}
