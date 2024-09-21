// ArtworkPage.tsx
import React from "react";
import { Image, Link } from "@nextui-org/react";

const ArtworkPage = async ({
  params,
}: {
  params: { category: string; artwork: string };
}) => {
  const { category, artwork: artworkName } = params;
  const decodedArtworkName = decodeURIComponent(artworkName);

  if (!decodedArtworkName || !category) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${category}/${decodedArtworkName}`
  );
  const data = await res.json();

  if (data.error) {
    // Handle error (e.g., show a 404 page)
    return <div>{data.error}</div>;
  }

  const { artwork, prevArtworkName, nextArtworkName } = data;
  return (
    <div>
      {/* Display the artwork */}
      <h1>{artwork.name}</h1>
      <Image src={artwork.src} alt={artwork.alt} />

      {/* Navigation links */}
      {prevArtworkName && (
        <Link href={`/gallery/${category}/${prevArtworkName}`}>
          Previous
        </Link>
      )}
      {nextArtworkName && (
        <Link href={`/gallery/${category}/${nextArtworkName}`}>Next</Link>
      )}
    </div>
  );
};

export default ArtworkPage;
