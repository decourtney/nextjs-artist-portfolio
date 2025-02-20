import Artwork, { ArtworkDocument } from "@/models/Artwork";
import CategoryList from "./CategoryList";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { Card, CardBody, Image } from "@heroui/react";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const GalleryPage = async () => {
  const response = await Artwork.find();
  const artworksData = JSON.parse(JSON.stringify(response));

  console.log("list of artwork", artworksData);
  return (
    <section className="min-h-dvh">
      <div className="text-center h-[50px] bg-secondary-100">FILTER BAR</div>
      <ul className="w-fit columns-3 gap-1 space-y-1">
        {artworksData.map((artwork: ArtworkDocument) => (
          <li key={artwork.name}>
            <img src={artwork.thumbSrc} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GalleryPage;
