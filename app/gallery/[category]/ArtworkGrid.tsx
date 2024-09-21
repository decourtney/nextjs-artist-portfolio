// ArtworkGrid.tsx (Client Component)
"use client";

import React, { use, useEffect, useState } from "react";
import { ArtworkDocument } from "@/models/Artwork";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardBody, Image } from "@nextui-org/react";
import Masonry from "react-masonry-css";
import { getCategoryArtwork } from "@/lib/getArtwork";
// import { useRouter } from "next/router";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ArtworkGrid = ({
  artworks,
  category,
  // limit,
  hasMore,
  currentPage,
}: {
  artworks: ArtworkDocument[];
  category: string;
  // limit: number;
  hasMore: boolean;
  currentPage: number;
}) => {
  const [artworkList, setArtworkList] = useState<ArtworkDocument[]>([]);
  const router = useRouter();
  const pathName = usePathname();
  // const [hasMoreArtwork, setHasMore] = useState(hasMore);
  // const [artworkList, setArtworkList] =
  //   useState<ArtworkDocument[]>(initialArtworks);
  // const [offset, setOffset] = useState(initialArtworks.length);
  // const searchParams = useSearchParams();

  useEffect(() => {
    setArtworkList(artworks);
    window.history.replaceState(null, "", `${pathName}`); // Clean URL of searchParams without refreshing the page
  }, [artworks]);

  const getNextPage = () => {
    router.replace(`${pathName}?page=${currentPage + 1}`, {
      scroll: false,
    });
  };

  console.log("pathName:", pathName);

  // const fetchArtwork = async () => {
  //   try {
  //     const { artworks, hasMore } = await getCategoryArtwork(
  //       category,
  //       limit.toString(),
  //       offset.toString()
  //     );

  //     //  const res = await fetch(
  //     //    `http://localhost:3000/api/gallery/${category}?offset=${offset}&limit=${limit}`
  //     //  );

  //     setHasMore(hasMore);
  //     setArtworkList((prev) => [...prev, ...artworks]);
  //     setOffset((prev) => prev + artworks.length);
  //   } catch (error) {
  //     console.error("Failed to fetch artwork:", error);
  //   }
  // };

  if (artworkList.length === 0) return <p>No artwork available.</p>;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <InfiniteScroll
      dataLength={artworkList.length}
      next={getNextPage}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="p-1"
      >
        {artworkList.map((art: ArtworkDocument, index: number) => (
          <Card
            key={index}
            isPressable
            fullWidth
            onPress={() => router.push(`/gallery/${category}/${art.name}`)}
            className="my-2"
          >
            <CardBody className="p-0">
              <Image src={art.src} alt={art.name} width={"100%"} />
            </CardBody>
          </Card>
        ))}
      </Masonry>
    </InfiniteScroll>
  );
};

export default ArtworkGrid;
