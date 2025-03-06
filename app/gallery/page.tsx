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

  const response: ArtworkDocument[] = await Artwork.find({});
  // const response = await Artwork.find();
  const artworksData = JSON.parse(JSON.stringify(response));

  return (
    <div className="flex h-[100dvh-64px] min-h-[100dvh-64px]">
      <div className="flex w-[20%] h-full p-4 bg-background-600">
        OR SIDE FILTER
      </div>

      <ul className="w-full columns-5 gap-1 space-y-1">
        {artworksData.map((artwork: ArtworkDocument) => (
          <li className=" " key={artwork.name}>
            <Image
              removeWrapper
              radius="none"
              src={artwork.thumbSrc}
              className="w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GalleryPage;
