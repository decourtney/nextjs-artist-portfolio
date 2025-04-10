import Artwork, { PopulatedArtworkDocument } from "@/models/Artwork";
import Tag, { TagDocument } from "@/models/Tag";
import FileManagement from "@/app/dashboard/_components/FileManagement";
import FileUpload from "@/app/dashboard/_components/FileUpload";
import TagManagement from "@/app/dashboard/_components/TagManagement";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const awaitedSearchParams = await searchParams;

  const page = parseInt(awaitedSearchParams.page || "1");
  const limit = parseInt(awaitedSearchParams.limit || "10");
  const skip = (page - 1) * limit;

  // Get total count for pagination info
  const totalCount = await Artwork.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch artworks with populated fields
  const artworkResponse = await Artwork.find({})
    .populate("category")
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
    <main className="w-full mx-auto">
      <div className="space-y-8">
        <FileManagement
          files={files}
          tags={allTags}
          currentPage={page}
          totalPages={totalPages}
        />

        <TagManagement tags={allTags} />

        <FileUpload />
      </div>
    </main>
  );
}
