"use server";

import dbConnect from "@/lib/dbConnect";
import { Tag } from "@/models";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { TagDocument } from "@/models/Tag";
import ImageDisplay from "../../_components/ImageDisplay";
import { ParseActiveFilters } from "@/utils/filters";
import { BuildQueryFromFilters } from "@/utils/buildQuery";

const FilteredDisplayPage = async ({
  params,
}: {
  params: Promise<{ filters?: string[] }>;
}) => {
  await dbConnect();
  const awaitedParams = await params;
  const { filters } = awaitedParams;

  // Fetch all tags for mapping filter labels to tag _id's.
  const tagData = await Tag.find();
  const tags = JSON.parse(JSON.stringify(tagData)) as TagDocument[];

  // If filters is undefined (unfiltered query), default to an empty array.
  // const filters = params.filters ?? [];
  // Parse filters into an object, e.g., { category: ["Effin-river"], medium: ["Oil"], size: ["Large"] }
  const activeFilters = ParseActiveFilters(filters || []);

  // Build the Mongoose query object using the extracted function
  const query = BuildQueryFromFilters(activeFilters, tags);

  // Query the Artwork collection using the built query object.
  const artworkData = await Artwork.find(query);
  const artworks = JSON.parse(JSON.stringify(artworkData)) as ArtworkDocument[];

  return (
    <div className="w-full min-h-[calc(100dvh-64px)] bg-background-100 p-4">
      <div className="max-w-[1400px] mx-auto">
        <ImageDisplay artworks={artworks} />
      </div>
    </div>
  );
};

export default FilteredDisplayPage;
