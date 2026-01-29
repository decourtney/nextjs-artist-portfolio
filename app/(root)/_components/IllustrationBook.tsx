"use client";

import { IllustrationArtworkObj } from "@/app/(root)/utils/getIllustrationWithOrderedArtworks";
import Image from "next/image";
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
  });

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative max-w-[1500px] w-full h-full">
        {/* Book container */}
        <div className="relative w-full grid grid-cols-[auto_1fr_auto] items-stretch">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center justify-center md:px-3 disabled:opacity-30"
          >
            <IoChevronBack size={32} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
            {/* Left page */}
            <div className="relative h-[250px] sm:h-[300px] lg:h-[400px] xl:h-[800px]">
              <Image
                src={currentData.src}
                alt={currentData.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Right page */}
            <div className="flex flex-col justify-start pt-8 px-6 lg:pt-8 xl:pt-24">
              <h2 className="text-3xl font-serif font-bold mb-4">
                {currentData.name}
              </h2>
              <p className="text-gray-700 text-lg font-serif">
                {currentData.description}
              </p>
            </div>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === artworks.length - 1}
            className="flex items-center justify-center md:px-3 disabled:opacity-30"
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
