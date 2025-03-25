"use client";

import { useFilteredArtworks } from "@/app/context/FilteredArtworkContext";
import { ArtworkDocument } from "@/models/Artwork";
import { Link, Skeleton } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageDisplayProps {
  artworks: ArtworkDocument[];
  // Optional filtersPath (a string built from your current filters) to append to the URL
}

// Separate component for each artwork thumbnail
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
          <Link
            href={`/artwork/${artwork.name}`}
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image
              src={artwork.thumbSrc}
              alt={artwork.name}
              fill
              sizes="100%"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </Skeleton>
    </li>
  );
};

const ImageDisplay = ({ artworks }: ImageDisplayProps) => {
  const { setFilteredNames } = useFilteredArtworks();

  useEffect(() => {
    // Save the filtered artworks in context
    const artworkNames = artworks.map((artwork) => {
      return artwork.name;
    });
    setFilteredNames(artworkNames);
  }, [artworks, setFilteredNames]);

  return (
    <ul className="w-full columns-1 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4 gap-1 space-y-1">
      {artworks.map((artwork) => (
        <ArtworkItem key={artwork._id} artwork={artwork} />
      ))}
    </ul>
  );
};

export default ImageDisplay;
