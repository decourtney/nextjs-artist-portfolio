import dbConnect from "@/lib/dbConnect";
import { Tag } from "@/models";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import { TagDocument } from "@/models/Tag";
import ImageDisplay from "./ImageDisplay";

// utils/filters.ts
export function parseActiveFilters(
  segments: string[]
): Record<string, string[]> {
  const active: Record<string, string[]> = {};
  for (const seg of segments) {
    // Split on the first dash
    const idx = seg.indexOf("-");
    if (idx === -1) {
      continue; // or handle error
    }
    const type = seg.slice(0, idx);
    const label = seg.slice(idx + 1);

    if (!active[type]) {
      active[type] = [];
    }
    active[type].push(label);
  }
  return active;
}

const FilteredDisplayPage = async ({
  params,
}: {
  params: { filters?: string[] };
}) => {
  await dbConnect();

  // Fetch all tags for mapping filter labels to tag _id's.
  const tagData = await Tag.find();
  const tags = JSON.parse(JSON.stringify(tagData)) as TagDocument[];

  // If filters is undefined (unfiltered query), default to an empty array.
  const filters = params.filters ?? [];
  // Parse filters into an object, e.g., { category: ["Effin-river"], medium: ["Oil"], size: ["Large"] }
  const activeFilters = parseActiveFilters(filters);

  // Build the Mongoose query object.
  const query: Record<string, any> = {};

  // --- Categories Filter (multi-select) ---
  if (activeFilters.category?.length) {
    const categoryTagIds = activeFilters.category
      .map((label) => {
        const matchingTag = tags.find((tag) => tag.label === label);
        return matchingTag?._id;
      })
      .filter((id) => id != null);

    if (categoryTagIds.length) {
      query.categories = { $in: categoryTagIds };
    }
  }

  // --- Medium Filter (assumed single-select) ---
  if (activeFilters.medium?.length) {
    const mediumTagIds = activeFilters.medium
      .map((label) => {
        const matchingTag = tags.find((tag) => tag.label === label);
        return matchingTag?._id;
      })
      .filter((id) => id != null);

    if (mediumTagIds.length) {
      // For single-select, only the first tag id is used.
      query.medium = mediumTagIds[0];
    }
  }

  // --- Size Filter (assumed single-select) ---
  if (activeFilters.size?.length) {
    const sizeTagIds = activeFilters.size
      .map((label) => {
        const matchingTag = tags.find((tag) => tag.label === label);
        return matchingTag?._id;
      })
      .filter((id) => id != null);

    if (sizeTagIds.length) {
      query.size = sizeTagIds[0];
    }
  }

  // Query the Artwork collection using the built query object.
  const artworkData = await Artwork.find(query);
  const artworks = JSON.parse(JSON.stringify(artworkData)) as ArtworkDocument[];

  return (
    <div className="w-full h-full">
      <ImageDisplay artworks={artworks} />
    </div>
  );
};

export default FilteredDisplayPage;
