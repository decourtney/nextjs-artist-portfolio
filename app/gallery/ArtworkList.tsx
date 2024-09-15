"use client";

import React, { useState } from "react";
import { ArtworkDocument } from "@/models/Artwork";
import InfiniteScroll from "react-infinite-scroll-component";
import { Image } from "@nextui-org/react";
import getArtwork from "@/lib/getArtwork";

const ArtworkList = ({
  artworkList,
  hasMore,
}: {
  artworkList: ArtworkDocument[];
  hasMore: boolean;
}) => {
  const [artwork, setArtwork] = useState<ArtworkDocument[]>(artworkList);
  const [offset, setOffset] = useState(2);
  const [limit, setLimit] = useState(10); // will need to change with screen size
  const [hasMoreArtwork, setHasMoreArtwork] = useState(hasMore);

  const fetchArtwork = async () => {
    const {artwork, hasMore} = await getArtwork(offset, limit);

    setArtwork((art)=>[...art, ...artwork]);
    setOffset(offset + 1);
    setHasMoreArtwork(hasMore);
  }

  console.log("artworks", artwork);
  return (
    <InfiniteScroll
      dataLength={artwork.length}
      next={fetchArtwork}
      hasMore={hasMoreArtwork}
      loader={<h4>Loading...</h4>}
    >
      {artwork.map((art: ArtworkDocument, index: number) => (
        <Image key={index} src={art.src}></Image>
      ))}
    </InfiniteScroll>
  );
};

export default ArtworkList;
