import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { Image, Skeleton } from "@heroui/react";
import React, { useState } from "react";
import ImageDisplay from "./ImageDisplay";
import dbConnect from "@/lib/dbConnect";
import { Tag } from "@/models";
import { TagDocument } from "@/models/Tag";

const FilteredDisplayPage = async ({
  params,
}: {
  params: { filters: string[] };
}) => {
  // console.log("Filter params: ", params.filters);
  await dbConnect();

  const artworkData = await Artwork.find();
  const tagData = await Tag.find();

  const artworks = JSON.parse(JSON.stringify(artworkData)) as ArtworkDocument[];
  const tags = JSON.parse(JSON.stringify(tagData)) as TagDocument[];

  return (
    <div className="w-full h-full">
      <ImageDisplay artworks={artworks} />
    </div>
  );
};

export default FilteredDisplayPage;
