import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { Image } from "@heroui/react";
// import CategoryList from "./CategoryList";
// import InfiniteScroll from "react-infinite-scroll-component";
// import Masonry from "react-masonry-css";
// import { Card, CardBody, Image } from "@heroui/react";

// const breakpointColumnsObj = {
//   default: 4,
//   1100: 3,
//   700: 2,
//   500: 1,
// };

const GalleryPage = async () => {
  await dbConnect(); // important!

  const response: ArtworkDocument[] = await Artwork.find({}).limit(10);
  // const response = await Artwork.find();
  const artworksData = JSON.parse(JSON.stringify(response));

  return (
    <section className="min-h-dvh">
      <div className="text-center content-center h-[50px] bg-secondary-100">
        TOP FILTER
      </div>

      <div className="flex flex-row">
        <div className="w-[20%] h-full p-4 text-center my-auto">
          OR SIDE FILTER
        </div>

        <ul className="w-fit columns-3 gap-1 space-y-1">
          {artworksData.map((artwork: ArtworkDocument) => (
            <li key={artwork.name}>
              <Image src={artwork.thumbSrc} alt="" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default GalleryPage;
