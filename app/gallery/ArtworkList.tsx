"use client";

import React, { useEffect, useState } from "react";
import { ArtworkDocument } from "@/models/Artwork";
import InfiniteScroll from "react-infinite-scroll-component";
import { Image } from "@nextui-org/react";
import getArtwork from "@/lib/getArtwork";

const ArtworkList = () => {
  const [artworkList, setArtworkList] = useState<ArtworkDocument[]>([]);
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(10); // will need to change with screen size
  const [hasMoreArtwork, setHasMoreArtwork] = useState(true);

  // BUG - maybe? i dont know, could be react? fetchArtwork runs twice on intial useEffect trigger but the state values are the same
  // runs fine after that though so screw it.
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

  return (
    <>
      <InfiniteScroll
        dataLength={artworkList.length}
        next={fetchArtwork}
        hasMore={hasMoreArtwork}
        loader={<h4>Loading...</h4>}
      >
        {artworkList.map((art: ArtworkDocument, index: number) => (
          <Image key={index} src={art.src}></Image>
        ))}
      </InfiniteScroll>
    </>
  );
};

export default ArtworkList;
