"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineFilter } from "react-icons/md";

interface MobileSidebarProps {
  children: React.ReactNode;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ children }) => {
  const panelWidth = 200; // width of the sidebar panel in pixels
  const threshold = 30; // drag threshold to toggle open/close
  const sensitivity = 5; // sensitivity multiplier for drag offset
  const toggleWidth = 40; // extra visible width when closed

  const [open, setOpen] = useState(true);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // Handle touch events on the panel container.
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartX === null) return;
    const offset = e.touches[0].clientX - dragStartX;
    const adjustedOffset = offset * sensitivity;
    // When closed, allow dragging to the right; when open, allow dragging to the left.
    if (!open && adjustedOffset > 0) {
      setDragOffset(adjustedOffset);
    } else if (open && adjustedOffset < 0) {
      setDragOffset(adjustedOffset);
    }
  };

  const handleTouchEnd = () => {
    if (!open && dragOffset > threshold) {
      setOpen(true);
    } else if (open && dragOffset < -threshold) {
      setOpen(false);
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  // Base translate: 0 when closed, panelWidth when open.
  const baseTranslate = open ? panelWidth : 0;
  let computedTranslate = baseTranslate + dragOffset;
  computedTranslate = Math.max(0, Math.min(panelWidth, computedTranslate));

  // Here we conditionally add toggleWidth only when closed.
  const finalTranslate = open
    ? computedTranslate - panelWidth
    : computedTranslate - panelWidth + toggleWidth;

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
      {/* Sidebar panel (with toggle button as a child) */}
      <div
        className={`fixed top-0 -left-[40px] min-h-[calc(100dvh+200px)] z-50 md:hidden transition-transform duration-300 bg-gradient-to-r from-content4-600 from-[50%] to-transparent to-[50%]`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setOpen(!open)}
        style={{
          width: `${panelWidth + 80}px`,
          height: "100%",
          transform: `translateX(${finalTranslate}px)`,
        }}
      >
        <div
          className={`relative w-[160px] h-full bg-content4-600 translate-x-[40px]`}
        >
          {/* Toggle button positioned on the right edge of the panel */}
          <button
            onClick={() => setOpen(!open)}
            className="absolute bottom-1/4 -right-10 h-16 transform -translate-y-1/2 bg-content4-600 p-2 rounded-r-full"
          >
            <MdOutlineFilter size={25} />
          </button>

          <div className="p-4 ">{children}</div>
        </div>
      </div>

      {/* Overlay to capture touches outside and close the sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
    </>
  );
};

export default MobileSidebar;
