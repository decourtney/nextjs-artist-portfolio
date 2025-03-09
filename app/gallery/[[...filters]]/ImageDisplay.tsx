"use client";

import { ArtworkDocument } from "@/models/Artwork";
import { Skeleton } from "@heroui/react";
import React, { useState } from "react";
import Image from "next/image";

interface ImageDisplayProps {
  artworks: ArtworkDocument[];
}

// Separate component for each artwork
const ArtworkItem = ({ artwork }: { artwork: ArtworkDocument }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li key={artwork._id}>
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
            loading="lazy"
            onLoadingComplete={() => setLoaded(true)}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </Skeleton>
    </li>
  );
};

const ImageDisplay = ({ artworks }: ImageDisplayProps) => {
  return (
    <ul className="w-full columns-1 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4 gap-1 space-y-1">
      {artworks.map((artwork) => (
        <ArtworkItem key={artwork._id} artwork={artwork} />
      ))}
    </ul>
  );
};

export default ImageDisplay;
