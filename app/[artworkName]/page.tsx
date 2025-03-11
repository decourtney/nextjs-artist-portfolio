"use client";

import { ArtworkDocument } from "@/models/Artwork";
import { Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFilteredArtworks } from "../context/FilteredArtworkContext";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import Image from "next/image";

interface ArtworkDetailPageProps {
  params: { artworkName: string };
}

export default function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  // Get the array of filtered artwork names (string[])
  const { filteredNames } = useFilteredArtworks();
  const router = useRouter();
  const [artworkDoc, setArtworkDoc] = useState<ArtworkDocument | null>(null);
  const [fetching, setfetching] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Fetch the ArtworkDocument for the current artworkName from the API.
  useEffect(() => {
    async function fetchArtwork() {
      setfetching(true);
      try {
        const res = await fetch(
          `/api/artworkByName/${encodeURIComponent(params.artworkName)}`
        );
        if (!res.ok) {
          console.error("Failed to fetch artwork document.");
          setArtworkDoc(null);
        } else {
          const data = await res.json();
          console.log(data);
          // Expecting { artwork: ArtworkDocument } from the API.
          setArtworkDoc(data.artwork);
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setArtworkDoc(null);
      } finally {
        setfetching(false);
      }
    }
    fetchArtwork();
  }, [params.artworkName]);

  // Determine the current index in the filtered names array.
  const currentIndex = filteredNames.findIndex(
    (name) => name === params.artworkName
  );
  const notFoundInContext = currentIndex === -1;

  // Use wrap-around navigation:
  // If not found in context, default to index 0 for navigation purposes.
  const displayIndex = notFoundInContext ? 0 : currentIndex;
  const total = filteredNames.length;
  const prevName =
    total > 0 ? filteredNames[(displayIndex - 1 + total) % total] : null;
  const nextName = total > 0 ? filteredNames[(displayIndex + 1) % total] : null;

  if (fetching) {
    return <div>Loading artwork details...</div>;
  }

  return (
    <div className=" p-4 text-foreground-100">
      <div className="w-full h-full">
        {artworkDoc ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom:
                artworkDoc.metaWidth && artworkDoc.metaHeight
                  ? `${(artworkDoc.metaHeight / artworkDoc.metaWidth) * 100}%`
                  : "100%", // fallback if missing data
            }}
          >
            {isLoaded ? (
              <Image
                src={artworkDoc.src}
                alt={artworkDoc.name}
                fill
                sizes="100%"
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className="absolute top-0 left-0 object-cover"
              />
            ) : (
              <Image
                src={artworkDoc.thumbSrc}
                alt={artworkDoc.name}
                fill
                sizes="100%"
                loading="lazy"
                className="absolute top-0 left-0 object-cover"
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-red-500">
            <p>Artwork document not found.</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h1 className="text-3xl font-bold">
          {artworkDoc ? artworkDoc.name : "Unknown Artwork"}
        </h1>
        {artworkDoc && artworkDoc.description && (
          <p>{artworkDoc.description}</p>
        )}
      </div>

      <div className="flex justify-between mt-4">
        {prevName && (
          <Link
            href={`/${prevName}`}
            className="text-blue-500 hover:underline flex items-center"
          >
            <IoIosArrowRoundBack size={24} />
            <span className="ml-1">Previous</span>
          </Link>
        )}
        {nextName && (
          <Link
            href={`/${nextName}`}
            className="text-blue-500 hover:underline flex items-center"
          >
            <span className="mr-1">Next</span>
            <IoIosArrowRoundForward size={24} />
          </Link>
        )}
      </div>

      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => router.back()}
      >
        Back to Gallery
      </button>
    </div>
  );
}
