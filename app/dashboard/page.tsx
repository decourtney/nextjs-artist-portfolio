import React from "react";
import FilePicker from "./FilePicker";
import Artwork, { PopulatedArtworkDocument } from "@/models/Artwork";
import Tag, { TagDocument } from "@/models/Tag";
import dynamic from "next/dynamic";
import FileList from "./FileList";

// const FileList = dynamic(() => import("./FileList"), {
//   ssr: false,
// });

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const skip = (page - 1) * limit;

  // Get total count for pagination info
  const totalCount = await Artwork.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch artworks with populated fields
  const artworkResponse = await Artwork.find({})
    .populate("categories")
    .populate("medium")
    .populate("size")
    .skip(skip)
    .limit(limit)
    .lean();

  // Fetch all tags (all types)
  const tagsResponse = await Tag.find({}).lean();

  const files: PopulatedArtworkDocument[] = JSON.parse(
    JSON.stringify(artworkResponse)
  );
  const tags: TagDocument[] = JSON.parse(JSON.stringify(tagsResponse));

  // Split tags by type
  const categories = tags.filter((tag: TagDocument) => tag.type === "category");
  const mediums = tags.filter((tag: TagDocument) => tag.type === "medium");
  const sizes = tags.filter((tag: TagDocument) => tag.type === "size");
  const allTags = { categories, mediums, sizes };

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-background-100">
      <div className="mx-auto">
        <FileList
          files={files}
          tags={allTags}
          currentPage={page}
          totalPages={totalPages}
        />
        <FilePicker />
      </div>
    </div>
  );
}
