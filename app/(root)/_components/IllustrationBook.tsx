"use client";

import { IllustrationArtworkObj } from "@/app/(root)/utils/getIllustrationWithOrderedArtworks";
import { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface IllustrationBookProps {
  artworks: IllustrationArtworkObj[];
}

const IllustrationBook = ({ artworks }: IllustrationBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, artworks.length - 1));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

  const currentData = artworks[currentPage];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative max-w-[1500px] w-full h-full">
        {/* Book container */}
        <div className="relative w-full rounded-2xl">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 max-h-screen aspect-[16/10]">
            {/* Left page */}
            <div className="flex justify-center p-8 md:pl-12 max-h-[800px]">
              <img
                src={currentData.src}
                alt={currentData.name}
                className="object-contain rounded-sm"
              />
            </div>

            {/* Right page */}
            <div className="flex flex-col justify-start p-8 md:pt-24 md:pr-24 md:pl-12">
              <h2 className="text-3xl font-serif font-bold mb-4">
                {currentData.name}
              </h2>
              <p className="text-gray-700 text-lg font-serif">
                {currentData.description}
              </p>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2"
          >
            <IoChevronBack size={32} />
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === artworks.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <IoChevronForward size={32} />
          </button>
        </div>

        {/* Page indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {artworks.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i === currentPage ? "bg-amber-500 w-8" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IllustrationBook;
