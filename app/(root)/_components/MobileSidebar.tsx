"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineFilter } from "react-icons/md";

/** Write the open/closed boolean to localStorage */
function setLSOpenStatus(status: boolean) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("mobileSidebarOpen", JSON.stringify(status));
  }
}

/** Read the open/closed boolean from localStorage */
function getLSOpenStatus(): boolean {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("mobileSidebarOpen");
    if (saved !== null) {
      return JSON.parse(saved);
    }
  }
  return false;
}

interface MobileSidebarProps {
  children: React.ReactNode;
}

export default function MobileSidebar({ children }: MobileSidebarProps) {
  const panelWidth = 200; // width of the sidebar panel in pixels
  const threshold = 30; // drag threshold to toggle open/close
  const sensitivity = 3; // sensitivity multiplier for drag offset
  const toggleWidth = 40; // extra visible width when closed

  // 1) Use lazy initialization so we read from localStorage once
  const [open, setOpen] = useState<boolean>(() => getLSOpenStatus());
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // Helper to toggle open/closed and always mirror to localStorage
  const setOpenState = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setLSOpenStatus(nextOpen);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartX == null) return;
    const offset = e.touches[0].clientX - dragStartX;
    const adjustedOffset = offset * sensitivity;

    // If closed, allow dragging to the right; if open, allow dragging to the left.
    if (!open && adjustedOffset > 0) {
      setDragOffset(adjustedOffset);
    } else if (open && adjustedOffset < 0) {
      setDragOffset(adjustedOffset);
    }
  };

  const handleTouchEnd = () => {
    if (!open && dragOffset > threshold) {
      // Switch to open
      setOpenState(true);
    } else if (open && dragOffset < -threshold) {
      // Switch to closed
      setOpenState(false);
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  // Calculate final transform
  const baseTranslate = open ? panelWidth : 0; // 0 when closed, panelWidth when open
  let computedTranslate = baseTranslate + dragOffset;
  computedTranslate = Math.max(0, Math.min(panelWidth, computedTranslate));

  // Add toggleWidth only if closed
  const finalTranslate = open
    ? computedTranslate - panelWidth
    : computedTranslate - panelWidth + toggleWidth;

  // Optional: close the sidebar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        setOpenState(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <>
      {/* The swipe/touch area */}
      <div
        className="fixed top-0 -left-[40px] min-h-[calc(100dvh+200px)] transition-transform duration-300 bg-gradient-to-r from-background-300 from-[50%] to-transparent to-[50%]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: `${panelWidth + 80}px`,
          height: "100%",
          transform: `translateX(${finalTranslate}px)`,
        }}
      >
        {/* The actual sidebar panel */}
        <div className="relative w-[160px] h-full bg-background-200 translate-x-[40px] border-r border-divider-200">
          <button
            onClick={() => setOpenState(!open)}
            className="absolute bottom-1/4 -right-10 h-16 transform -translate-y-1/2 bg-background-200 p-2 rounded-r-full border-r border-t border-b border-divider-200"
          >
            <MdOutlineFilter size={25} className="text-foreground-500" />
          </button>

          {children}
        </div>
      </div>

      {/* Dark overlay when sidebar is open */}
      <div
        className={`
          fixed inset-0 -z-10 bg-overlay-500 bg-opacity-50 transition-opacity duration-300 md:hidden
          ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={() => setOpenState(false)}
      />
    </>
  );
}
