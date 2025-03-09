"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArtworkDocument } from "@/models/Artwork";
import { Image as HeroImage, Skeleton } from "@heroui/react";

interface ImageDisplayProps {
  artworks: ArtworkDocument[];
}

interface FullScreenModalProps {
  artwork: ArtworkDocument;
  onClose: () => void;
}

const FullScreenModal = ({ artwork, onClose }: FullScreenModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl z-10"
        >
          &times;
        </button>
        <div className="relative w-full h-[80vh]">
          <HeroImage
            src={artwork.src} // assuming you have a high-resolution image URL
            fallbackSrc={artwork.thumbSrc}
            alt={artwork.name}
            sizes="100%"
            className="object-contain"
          />
        </div>
        <div className="mt-4 text-white">
          <h2 className="text-2xl font-bold">{artwork.name}</h2>
          {/* Render additional metadata as needed */}
          <p>{artwork.description}</p>
        </div>
      </div>
    </div>
  );
};

// Separate component for each artwork thumbnail
const ArtworkItem = ({
  artwork,
  onClick,
}: {
  artwork: ArtworkDocument;
  onClick: (artwork: ArtworkDocument) => void;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li
      key={artwork._id}
      onClick={() => onClick(artwork)}
      className="cursor-pointer"
    >
      <Skeleton isLoaded={loaded}>
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom:
              artwork.metaWidth && artwork.metaHeight
                ? `${(artwork.metaHeight / artwork.metaWidth) * 100}%`
                : "100%", // fallback if missing data
          }}
        >
          <Image
            src={artwork.thumbSrc}
            alt={artwork.name}
            fill
            sizes="100%"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </Skeleton>
    </li>
  );
};

const ImageDisplay = ({ artworks }: ImageDisplayProps) => {
  const [activeArtwork, setActiveArtwork] = useState<ArtworkDocument | null>(
    null
  );

  return (
    <>
      <ul className="w-full columns-1 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4 gap-1 space-y-1">
        {artworks.map((artwork) => (
          <ArtworkItem
            key={artwork._id}
            artwork={artwork}
            onClick={(artwork) => setActiveArtwork(artwork)}
          />
        ))}
      </ul>

      {activeArtwork && (
        <FullScreenModal
          artwork={activeArtwork}
          onClose={() => setActiveArtwork(null)}
        />
      )}
    </>
  );
};

export default ImageDisplay;
