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

  if (fetching) {
    return <div>Loading artwork details...</div>;
  }

  return (
    <div {...swipeHandlers} className="h-full">
      {/* <div className="w-fit max-h-[65%] mx-auto"> */}
      {/* <Skeleton isLoaded={loaded}> */}
      <div className="w-fit md:h-[65%] mx-auto">
        <div className="flex h-full">
            {artworkDoc ? (
              <Image
                // removeWrapper
                src={artworkDoc.src}
                fallbackSrc={artworkDoc.thumbSrc}
                alt={artworkDoc.name}
                radius="none"
                loading="lazy"
                className="w-full h-full object-contain"
                onLoad={() => setLoaded(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-foreground-100">
                <p>Couldn't find artwork.</p>
              </div>
            )}
        </div>

        <div className="hidden md:flex md:h-10 justify-between">
          {/* {prevName && ( */}
          <Link
            href={`/${prevName}`}
            className="group flex justify-start items-center w-full pl-10 text-foreground-300 hover:bg-background-200"
          >
            <IoIosArrowRoundBack size={40} />
          </Link>
          {/* )} */}

          {/* {nextName && ( */}
          <Link
            href={`/${nextName}`}
            className="group flex justify-end items-center w-full pr-10 text-foreground-300 hover:bg-background-200"
          >
            <IoIosArrowRoundForward size={40} />
          </Link>
          {/* )} */}
        </div>
      </div>

      {/* </Skeleton> */}

      {/* <div className="hidden md:flex  md:h-10 justify-between">
            {prevName && (
              <Link
                href={`/${prevName}`}
                className="group flex justify-start items-center w-full pl-10 text-foreground-300 hover:bg-background-200"
              >
                <IoIosArrowRoundBack size={40} />
              </Link>
            )}

            {nextName && (
              <Link
                href={`/${nextName}`}
                className="group flex justify-end items-center w-full pr-10 text-foreground-300 hover:bg-background-200"
              >
                <IoIosArrowRoundForward size={40} />
              </Link>
            )}
          </div> */}
      {/* </div> */}

      <div className="max-w-[600px] mt-10 mx-auto px-2 text-foreground-300">
        <h1 className="text-center text-3xl font-bold">
          {artworkDoc?.name || ""}
        </h1>

        <div className="flex justify-center gap-4 font-medium text-sm">
          <h2>{artworkDoc?.medium?.label || ""}</h2>
          <h2>{artworkDoc?.size?.label || ""}</h2>
        </div>

        <div className="mt-2">
          <p>{artworkDoc?.description || ""}</p>
        </div>
      </div>
    </div>
  );
}
