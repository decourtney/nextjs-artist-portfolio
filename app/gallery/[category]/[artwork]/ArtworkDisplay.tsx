"use client";

import React from "react";
import { ArtworkDocument } from "@/models/Artwork";
import { Button, Image } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";

const ArtworkDisplay = ({
  artwork,
  prevArtworkName,
  nextArtworkName,
}: {
  artwork: ArtworkDocument;
  prevArtworkName: string | null;
  nextArtworkName: string | null;
}) => {
  const router = useRouter();
  const params = useParams(); // Get the current category and artworkName from params

  // Helper function to construct a new URL by replacing only the artworkName
  const updateArtworkInParams = (newArtworkName: string) => {
    const { category } = params; // Extract the category from the params
    return `/gallery/${category}/${newArtworkName}`; // Construct a new URL with the updated artworkName
  };

  return (
    <>
      {/* Display the artwork */}
      <h1>{artwork.name}</h1>
      <Image src={artwork.src} alt={artwork.alt} />

      {/* Navigation links */}
      <Button
        isDisabled={!prevArtworkName}
        onPress={() => {
          router.replace(updateArtworkInParams(prevArtworkName || "")); // Navigate to the previous artwork
        }}
      >
        Previous
      </Button>

      <Button
        isDisabled={!nextArtworkName}
        onPress={() => {
          router.replace(updateArtworkInParams(nextArtworkName || "")); // Navigate to the next artwork
        }}
      >
        Next
      </Button>
    </>
  );
};

export default ArtworkDisplay;
