// ArtworkGrid.tsx (Client Component)
"use client";

import React, { useEffect, useState } from "react";
import { ArtworkDocument } from "@/models/Artwork";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardBody, Image } from "@nextui-org/react";
import Masonry from "react-masonry-css";
import {getCategoryArtwork} from "@/lib/getArtwork";
import { useRouter } from "next/navigation";

const ArtworkGrid = ({
  initialArtwork,
  category,
  limit,
  initialHasMore,
}: {
  initialArtwork: ArtworkDocument[];
  category: string;
  limit: number;
  initialHasMore: boolean;
}) => {
  const [artworkList, setArtworkList] =
    useState<ArtworkDocument[]>(initialArtwork);
  const [offset, setOffset] = useState(initialArtwork.length);
  const [hasMoreArtwork, setHasMore] = useState(initialHasMore);
  const router = useRouter();

  const fetchArtwork = async () => {
    try {
      const { artwork, hasMore } = await getCategoryArtwork(
        category,
        limit.toString(),
        offset.toString()
      );

      setHasMore(hasMore);
      setArtworkList((prev) => [...prev, ...artwork]);
      setOffset((prev) => prev + artwork.length);
    } catch (error) {
      console.error("Failed to fetch artwork:", error);
    }
  };

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
      next={fetchArtwork}
      hasMore={hasMoreArtwork}
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
