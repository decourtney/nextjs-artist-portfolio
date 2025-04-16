import Artwork, { PopulatedArtworkDocument } from "@/models/Artwork";
import Tag, { TagDocument } from "@/models/Tag";
import FileManagement from "@/app/dashboard/_components/FileManagement";
import FileUpload from "@/app/dashboard/_components/FileUpload";
import TagManagement from "@/app/dashboard/_components/TagManagement";
import dbConnect from "@/lib/dbConnect";
import { notFound } from "next/navigation";
import ProfileManagement from "./_components/ProfileManagement";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  try {
    await dbConnect();
    const awaitedSearchParams = await searchParams;

    const page = parseInt(awaitedSearchParams.page || "1");
    const limit = parseInt(awaitedSearchParams.limit || "10");
    const skip = (page - 1) * limit;

    const [totalCount, artworkResponse, tagsResponse] = await Promise.all([
      Artwork.countDocuments({}).maxTimeMS(10000),
      Artwork.find({})
        .populate("substance")
        .populate("medium")
        .populate("size")
        .populate("category")
        .skip(skip)
        .limit(limit)
        .lean()
        .maxTimeMS(10000),
      Tag.find({}).lean().maxTimeMS(10000),
    ]);

    const artworkDocuments: PopulatedArtworkDocument[] = JSON.parse(
      JSON.stringify(artworkResponse)
    );
    const tags: TagDocument[] = JSON.parse(JSON.stringify(tagsResponse));

    // Split tags by type
    const substances = tags.filter(
      (tag: TagDocument) => tag.type === "substance"
    );
    const mediums = tags.filter((tag: TagDocument) => tag.type === "medium");
    const sizes = tags.filter((tag: TagDocument) => tag.type === "size");
    const categories = tags.filter(
      (tag: TagDocument) => tag.type === "category"
    );

    const allTags = { substances, mediums, sizes, categories };

    return (
      <main className="w-full mx-auto">
        <div className="space-y-8">
          <ProfileManagement />
          <FileManagement
            files={artworkDocuments}
            tags={allTags}
            currentPage={page}
            totalPages={totalCount}
          />

          <TagManagement tags={allTags} />

          <FileUpload />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    notFound();
  }
}
