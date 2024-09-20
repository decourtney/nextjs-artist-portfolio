"use server";

import React from "react";
import ArtworkDisplay from "./ArtworkDisplay";
import { ArtworkDocument } from "@/models/Artwork";

interface ArtworkPageProps {
  params: { category: string; artwork: string };
}

const ArtworkPage = async ({ params }: ArtworkPageProps) => {
  const { category, artwork } = params;

  // Decode the URL-encoded artworkName name
  const decodedArtworkName = decodeURIComponent(artwork);

  // Fetch artwork in the category
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${category}/${decodedArtworkName}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  const artworkData: ArtworkDocument = data.artwork;

  // Add buttons to navigate to the next and previous artwork.
  return (
    <main className="h-[calc(100dvh-80px)]">
      <div className="w-[80%] mx-auto bg-blue-500">
        <ArtworkDisplay artwork={artworkData} />
      </div>
    </main>
  );
};

export default ArtworkPage;
