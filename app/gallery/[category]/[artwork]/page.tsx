// ArtworkPage.tsx
import React from "react";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import ArtworkDisplay from "./ArtworkDisplay";

const ArtworkPage = async ({
  params,
}: {
  params: { category: string; artwork: string };
}) => {
  const { category, artwork: artworkName } = params;
  const decodedArtworkName = decodeURIComponent(artworkName);

  if (!decodedArtworkName || !category) return null;

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${category}/${decodedArtworkName}`
  // );
  // const data = await res.json();

  // if (artworksData.error) {
  //   // Handle error (e.g., show a 404 page)
  //   return <div>{artworksData.error}</div>;
  // }

  // const { artwork, prevArtworkName, nextArtworkName } = data;

  const artworksData = await Artwork.find(
    category === "all" ? {} : { category }
  ).sort({ name: 1 }); // Adjust the sort field as needed

  const artworks: ArtworkDocument[] = JSON.parse(JSON.stringify(artworksData));

  const index = artworks.findIndex((art) => art.name === decodedArtworkName);
  if (index === -1) {
    return <div>{"Could not find that artwork"}</div>;
  }

  const artwork = artworks[index];
  const prevArtworkName = index > 0 ? artworks[index - 1].name : null;
  const nextArtworkName =
    index < artworks.length - 1 ? artworks[index + 1].name : null;

  return (
    <div>
     <ArtworkDisplay artwork={artwork} prevArtworkName={prevArtworkName} nextArtworkName={nextArtworkName}/>
    </div>
  );
};

export default ArtworkPage;
