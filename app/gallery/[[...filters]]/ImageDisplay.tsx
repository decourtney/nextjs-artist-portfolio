'use client'

import { ArtworkDocument } from "@/models/Artwork";
import { Image, Skeleton } from "@heroui/react";
import React, { useState } from "react";

interface ImageDisplayProps {
  artworks: ArtworkDocument[];
}

const ImageDisplay = ({ artworks }: ImageDisplayProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ul className="w-full columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-1 space-y-1">
      {artworks.map((artwork: ArtworkDocument) => (
        <li key={artwork._id}>
          <Skeleton isLoaded={isLoaded}>
            <div
              style={{
                position: "relative",
                width: "100%",
                // The padding-bottom sets the container’s height as a percentage of its width.
                // This ensures the container stays at the correct aspect ratio.
                paddingBottom:
                  artwork.metaWidth && artwork.metaHeight
                    ? `${(artwork.metaHeight / artwork.metaWidth) * 100}%`
                    : "100%", // fallback if missing data
              }}
            >
              {/* The actual image is absolutely placed over it */}
              <Image
                removeWrapper
                radius="none"
                src={artwork.thumbSrc}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          </Skeleton>
        </li>
      ))}
    </ul>
  );
};

export default ImageDisplay;
