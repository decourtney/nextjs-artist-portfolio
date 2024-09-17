import Artwork, { ArtworkDocument } from "../../models/Artwork";
import InfiniteScroll from "react-infinite-scroll-component";
import { Image } from "@nextui-org/react";
import getArtwork from "@/lib/getArtwork";
import { NextResponse } from "next/server";
import ArtworkList from "./ArtworkList";

const GalleryPage = async () => {
  // const { artwork, hasMore } = await getArtwork(1);

  return (
    <main className="min-h-dvh">
      <div className="w-fit">
        <ArtworkList/>
      </div>
    </main>
  );
};

export default GalleryPage;
