import { GetServerSideProps } from "next";
import dbConnect from "../../lib/dbConnect";
import Artwork, { ArtworkDocument } from "../../models/Artwork";
import InfiniteScroll from "react-infinite-scroll-component";
import { Image } from "@nextui-org/react";

const GalleryPage = async () => {
  const fetchArtwork = async () => {
    const res = await fetch("/api/artwork");
    const art = await res.json();
    console.log(art);
  };

  // const artworks = await fetchArtwork();

  const artworks:ArtworkDocument[] = await Artwork.find({});
  console.log("List of artwork:", artworks);

  return (
    <main>
      <div>
        {artworks.map((art) => (
          <Image key={art.name} src={art.src} alt={art.alt}></Image>
        ))}
        {/* <InfiniteScroll
          dataLength={artworks.length}
          next={fetchArtwork}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          {artworks.map((art) => (
            <Image></Image>
          ))}
        </InfiniteScroll> */}
      </div>
    </main>
  );
};

export default GalleryPage;
