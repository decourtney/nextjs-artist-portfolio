"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { Link, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFilteredArtworks } from "@/app/context/FilteredArtworkContext";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useSwipeable } from "react-swipeable";
import { toTitleCase } from "@/utils/titleCase";
import { use } from "react";
// import Image from "next/image";

interface ArtworkDetailPageProps {
  params: Promise<{ artworkName: string }>;
}

export default function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const router = useRouter();
  const [artworkDoc, setArtworkDoc] = useState<PopulatedArtworkDocument | null>(
    null
  );
  const [fetching, setfetching] = useState<boolean>(true);
  const [loaded, setLoaded] = useState(false);
  const { filteredNames } = useFilteredArtworks();
  const { artworkName } = use(params);

  // Fetch the ArtworkDocument for the current artworkName from the API.
  useEffect(() => {
    async function fetchArtwork() {
      try {
        const res = await fetch(
          `/api/artworkByName/${encodeURIComponent(artworkName)}`
        );
        if (!res.ok) {
          console.error("Failed to fetch artwork document.");
          setArtworkDoc(null);
        } else {
          const { artwork } = (await res.json()) as {
            artwork: PopulatedArtworkDocument;
          };

          setArtworkDoc(artwork);
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setArtworkDoc(null);
      } finally {
        setfetching(false);
      }
    }

    fetchArtwork();
  }, [artworkName]);

  // Determine the current index in the filtered names array.
  const currentIndex = filteredNames.findIndex((name) => name === artworkName);
  const notFoundInContext = currentIndex === -1;

  // Use wrap-around navigation:
  // If not found in context, default to index 0.
  const displayIndex = notFoundInContext ? 0 : currentIndex;
  const total = filteredNames.length;
  const prevName =
    total > 0 ? filteredNames[(displayIndex - 1 + total) % total] : null;
  const nextName = total > 0 ? filteredNames[(displayIndex + 1) % total] : null;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextName) {
        router.push(`/artwork/${nextName}`);
      }
    },
    onSwipedRight: () => {
      if (prevName) {
        router.push(`/artwork/${prevName}`);
      }
    },
    trackMouse: true,
  });

  if (fetching) {
    return null;
  }

  if (!artworkDoc) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100dvh-112px)] font-bold text-lg text-center text-foreground-300">
        <p>Could not find the artwork.</p>
      </div>
    );
  }

  // TODO: Add unmount animation for smoother transitions and maybe add a little variety to the animations.
  // Loaded state is used to control the opacity of the image and details individually.
  return (
    <div
      {...swipeHandlers}
      className="relative flex flex-col md:flex-row pb-6 w-full min-h-[calc(100dvh-112px)] md:h-[calc(100dvh-112px)] overflow-scroll"
    >
      <div
        className={`hidden md:block flex-1 min-w-fit h-full text-foreground-500 transition-opacity duration-1000 ${
          prevName && loaded ? "opacity-100:" : "opacity-0"
        }`}
      >
        <Link
          href={`/artwork/${prevName}`}
          className={`${
            !prevName && "invisible"
          } h-full w-full p-2 place-content-center`}
        >
          <IoIosArrowRoundBack size={40} />
        </Link>
      </div>

      <>
        {/* Image */}
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

        {/* Image Details */}
        <div
          className={`md:max-w-[400px] min-w-[300px] p-4 md:my-auto text-foreground-300 transition-opacity duration-700 ${
            loaded ? "opacity-100:" : "opacity-0" // may need to change from checking loaded to checking fetching if skeleton added to image
          }`}
        >
          <h1 className="text-center text-3xl font-bold">
            {toTitleCase(artworkDoc.name || "")}
          </h1>

          <div className="flex justify-center gap-4 font-medium text-sm">
            <h2>{artworkDoc.medium?.label || ""}</h2>
            <h2>{artworkDoc.size?.label || ""}</h2>
          </div>

          <div className="mt-2">
            <p>{artworkDoc.description || ""}</p>
          </div>
        </div>
      </>

      <div
        className={`hidden md:block flex-1 min-w-fit h-full text-foreground-500 transition-opacity duration-1000 ${
          nextName && loaded ? "opacity-100:" : "opacity-0"
        }`}
      >
        <Link
          href={`/artwork/${nextName}`}
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
