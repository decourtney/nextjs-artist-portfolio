import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import ImageDisplay from "./ImageDisplay";
import { Tag } from "@/models";
import { TagDocument } from "@/models/Tag";
import { TagType } from "@/types/tagType";

function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const GalleryPage = async () => {
  await dbConnect();

  const artworkData = await Artwork.find();
  const tagData = await Tag.find();

  const artworks = JSON.parse(JSON.stringify(artworkData)) as ArtworkDocument[];
  const tags = JSON.parse(JSON.stringify(tagData)) as TagDocument;

  Object.values(TagType).forEach((value) => {
    console.log(toTitleCase(value));
  });

  return (
    <div className="flex w-full h-[100dvh-64px] min-h-[100dvh-64px]">
      <div className="flex w-[20%] h-full p-4">
        <div className="w-full">
          {Object.values(TagType).map((typeValue) => (
            <ul key={typeValue} className="w-full font-medium text-center text-4xl text-foreground-300">
              {toTitleCase(typeValue)}
            </ul>
          ))}
        </div>
      </div>

      <ImageDisplay artworks={artworks} />
    </div>
  );
};

export default GalleryPage;
