"use client";

import React, { useEffect, useState } from "react";
import { ArtworkDocument } from "@/models/Artwork";
import InfiniteScroll from "react-infinite-scroll-component";
import { Image } from "@nextui-org/react";
import getArtwork from "@/lib/getArtwork";
import Masonry from "react-masonry-css";

const ArtworkList = () => {
  const [artworkList, setArtworkList] = useState<ArtworkDocument[]>([]);
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMoreArtwork, setHasMoreArtwork] = useState(true);

  const fetchArtwork = async () => {
    const { artwork, hasMore } = await getArtwork(offset, limit);
    setOffset(offset + 1);
    setHasMoreArtwork(hasMore);
    setArtworkList([...artworkList, ...artwork]);
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  if (artworkList.length === 0) return <h3>Loading...</h3>;

  // TODO - match breakpoints with tailwindcss
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
        columnClassName="p-2"
      >
        {artworkList.map((art: ArtworkDocument, index: number) => (
          <div key={index} className="pb-4">
            <Image src={art.src} width={"100%"} />
          </div>
        ))}
      </Masonry>
    </InfiniteScroll>
  );
};

export default ArtworkList;
