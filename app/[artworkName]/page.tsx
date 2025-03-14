"use client";

import { ArtworkDocument, PopulatedArtworkDocument } from "@/models/Artwork";
import { Link, Image, LinkIcon, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFilteredArtworks } from "../context/FilteredArtworkContext";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import Footer from "../footer";
import { useSwipeable } from "react-swipeable";
import { toTitleCase } from "@/utils/titleCase";
// import Image from "next/image";

interface ArtworkDetailPageProps {
  params: { artworkName: string };
}

export default function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  // Get the array of filtered artwork names (string[])
  const { filteredNames } = useFilteredArtworks();
  const router = useRouter();
  const [artworkDoc, setArtworkDoc] = useState<PopulatedArtworkDocument | null>(
    null
  );
  const [fetching, setfetching] = useState<boolean>(true);
  const [loaded, setLoaded] = useState(false);

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

          // Expecting { artwork: ArtworkDocument } from the API.
          setArtworkDoc(data.artwork as PopulatedArtworkDocument);
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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextName) {
        router.push(`/${nextName}`);
      }
    },
    onSwipedRight: () => {
      if (prevName) {
        router.push(`/${prevName}`);
      }
    },
    trackMouse: true,
  });

  if (fetching && !loaded) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100dvh-112px)] font-bold text-lg text-center text-foreground-300">
        Loading...
      </div>
    );
  }

  return (
    <div
      {...swipeHandlers}
      className="relative flex flex-col md:flex-row pb-6 w-full min-h-[calc(100dvh-112px)] md:h-[calc(100dvh-112px)] overflow-scroll"
    >
      <div
        className={`hidden md:block flex-1 min-w-fit h-full text-foreground-500 transition-opacity duration-1000 ${
          artworkDoc === null || loaded ? "opacity-100:" : "opacity-0"
        }`}
      >
        <Link
          href={`/${prevName}`}
          className={`${
            !prevName && "invisible"
          } h-full w-full p-2 place-content-center`}
        >
          <IoIosArrowRoundBack size={40} />
        </Link>
      </div>

      {/* Image */}

      {artworkDoc ? (
        <div
          className={`flex h-full aspect-auto transition-opacity duration-700 ${
            loaded ? "opacity-100:" : "opacity-0"
          }`}
        >
          <Image
            src={artworkDoc.src}
            alt={artworkDoc.name}
            radius="none"
            loading="eager"
            className="w-full h-full object-contain"
            onLoad={() => setLoaded(true)}
          />
        </div>
      ) : (
        <div className="mx-auto my-auto text-2xl text-foreground-100">
          <p>Couldn't find artwork.</p>
        </div>
      )}

      {/* Image Details */}
      {artworkDoc && (
        <div
          className={`md:max-w-[400px] min-w-[300px] p-4 md:my-auto text-foreground-300 transition-opacity duration-700 ${
            loaded ? "opacity-100:" : "opacity-0"
          }`}
        >
          <h1 className="text-center text-3xl font-bold">
            {toTitleCase(artworkDoc?.name || "")}
          </h1>

          <div className="flex justify-center gap-4 font-medium text-sm">
            <h2>{artworkDoc?.medium?.label || ""}</h2>
            <h2>{artworkDoc?.size?.label || ""}</h2>
          </div>

          <div className="mt-2">
            <p>{artworkDoc?.description || ""}</p>
          </div>
        </div>
      )}

      <div
        className={`hidden md:block flex-1 min-w-fit h-full text-foreground-500 transition-opacity duration-1000 ${
          artworkDoc === null || loaded ? "opacity-100:" : "opacity-0"
        }`}
      >
        <Link
          href={`/${nextName}`}
          className={`${
            !nextName && "invisible"
          } h-full w-full p-2 place-content-center`}
        >
          <IoIosArrowRoundForward size={40} />
        </Link>
      </div>
    </div>
  );
}
