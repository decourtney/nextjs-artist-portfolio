import Artwork, { PopulatedArtworkDocument } from "@/models/Artwork";
import Tag, { TagDocument } from "@/models/Tag";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the client component so the server doesn't access its internals
const ListOfFilesClient = dynamic(() => import("./app/dashboard/ListItems"), {
  ssr: false,
});

export default async function ListOfFiles() {
  // Fetch artworks with populated fields
  const artworkResponse = await Artwork.find({})
    .populate("categories")
    .populate("medium")
    .populate("size")
    .lean();

  // Fetch all tags (all types: category, medium, size, etc.)
  const tagsResponse = await Tag.find({}).lean();

  // Convert to JSON-serializable objects
  const files: PopulatedArtworkDocument[] = JSON.parse(
    JSON.stringify(artworkResponse)
  );
  const tags: TagDocument[] = JSON.parse(JSON.stringify(tagsResponse));

  // Split tags by type
  const categories: TagDocument[] = tags.filter(
    (tag: TagDocument) => tag.type === "category"
  );
  const mediums: TagDocument[] = tags.filter(
    (tag: TagDocument) => tag.type === "medium"
  );
  const sizes: TagDocument[] = tags.filter(
    (tag: TagDocument) => tag.type === "size"
  );

  // Optionally, pass all tags as well if needed
  const allTags = { categories, mediums, sizes };

  return <ListOfFilesClient files={files} tags={allTags} />;
}
