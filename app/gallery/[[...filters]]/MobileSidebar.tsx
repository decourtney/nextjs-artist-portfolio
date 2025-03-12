"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineFilter } from "react-icons/md";

interface MobileSidebarProps {
  children: React.ReactNode;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ children }) => {
  const [open, setOpen] = useState(true);

  // Close sidebar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        setOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <>
      {/* Toggle button visible only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-[64px] left-0 z-30 md:hidden bg-content4-900 p-2 rounded-r-md shadow"
      >
        <MdOutlineFilter size={25}/>
      </button>

      {/* Overlay to capture touch-off */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 z-50 w-40 h-full bg-content4-900 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

export default MobileSidebar;
