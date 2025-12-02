"use client";

import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Temporary mock data - replace with your actual data later
const mockPages = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    title: "First Illustration",
    description:
      "This is a beautiful piece that captures the essence of nature. The colors blend seamlessly to create a harmonious composition that draws the viewer in.",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    title: "Second Creation",
    description:
      "An exploration of light and shadow, this work demonstrates the power of contrast. Each brushstroke tells a story of its own.",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800",
    title: "Third Masterpiece",
    description:
      "Bold and expressive, this piece challenges traditional boundaries. The vibrant palette evokes strong emotions and invites contemplation.",
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
    title: "Fourth Vision",
    description:
      "A delicate balance of form and color creates a sense of movement. This work represents a journey through imagination and reality.",
  },
];

const IllustrationBook = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < mockPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentData = mockPages[currentPage];

  // Add keyboard navigation
  if (typeof window !== "undefined") {
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const event = new CustomEvent("bookNavigation", { detail: e.key });
        window.dispatchEvent(event);
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-7xl w-full">
        {/* Book Container */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ aspectRatio: "16/10" }}
        >
          {/* Book Spine Shadow */}
          <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 transform -translate-x-1/2 z-10 shadow-inner"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Left Page - Image */}
            <div className="relative bg-gray-50 flex items-center justify-center p-8 md:p-12">
              <div className="relative w-full h-full max-w-md max-h-[600px]">
                <img
                  src={currentData.imageUrl}
                  alt={currentData.title}
                  className="w-full h-full object-contain rounded-lg shadow-lg"
                />

                {/* Page Number - Left */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm font-serif">
                  {currentPage * 2 + 1}
                </div>
              </div>
            </div>

            {/* Right Page - Description */}
            <div className="relative bg-white flex flex-col justify-center p-8 md:p-12">
              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
                    {currentData.title}
                  </h2>
                  <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed font-serif">
                  {currentData.description}
                </p>

                {/* Additional Info */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium">Page {currentPage + 1}</span>
                    <span>of</span>
                    <span className="font-medium">{mockPages.length}</span>
                  </div>
                </div>

                {/* Page Number - Right */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm font-serif">
                  {currentPage * 2 + 2}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`
              absolute left-4 top-1/2 transform -translate-y-1/2 z-20
              w-12 h-12 rounded-full flex items-center justify-center
              transition-all duration-300 shadow-lg
              ${
                currentPage === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-amber-500 hover:text-white hover:scale-110"
              }
            `}
          >
            <IoChevronBack size={24} />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === mockPages.length - 1}
            className={`
              absolute right-4 top-1/2 transform -translate-y-1/2 z-20
              w-12 h-12 rounded-full flex items-center justify-center
              transition-all duration-300 shadow-lg
              ${
                currentPage === mockPages.length - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-amber-500 hover:text-white hover:scale-110"
              }
            `}
          >
            <IoChevronForward size={24} />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {mockPages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${
                  index === currentPage
                    ? "bg-amber-500 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }
              `}
            />
          ))}
        </div>

        {/* Keyboard Hint */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Use arrow keys to navigate ← →
        </div>
      </div>
    </div>
  );
};

export default IllustrationBook;
