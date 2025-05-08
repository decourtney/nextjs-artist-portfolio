import Artwork, { PopulatedArtworkDocument } from "@/models/Artwork";
import Tag, { TagDocument } from "@/models/Tag";
import FileManagement from "@/app/(dashboard)/dashboard/_components/FileManagement";
import FileUpload from "@/app/(dashboard)/dashboard/_components/FileUpload";
import TagManagement from "@/app/(dashboard)/dashboard/_components/TagManagement";
import dbConnect from "@/lib/dbConnect";
import { notFound } from "next/navigation";
import ProfileManagement from "@/app/(dashboard)/dashboard/_components/ProfileManagement";

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

    // const [totalCount, artworkResponse, tagsResponse] = await Promise.all([
    //   Artwork.countDocuments({}).maxTimeMS(10000),
    //   Artwork.find({})
    //     .sort({
    //       isMainImage: -1,
    //       isFeatured: -1,
    //       isCategoryImage: -1,
    //     })
    //     .populate("substance")
    //     .populate("medium")
    //     .populate("size")
    //     .populate("category")
    //     .skip(skip)
    //     .limit(limit)
    //     .lean()
    //     .maxTimeMS(10000),
    //   Tag.find({}).lean().maxTimeMS(10000),
    // ]);

    const tagsResponse = await Tag.find({}).lean().maxTimeMS(10000);
    const aggregateQueryResult = await Artwork.aggregate([
      {
        $lookup: {
          from: "tags",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "tags",
          localField: "substance",
          foreignField: "_id",
          as: "substance",
        },
      },
      {
        $unwind: { path: "$substance", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "tags",
          localField: "medium",
          foreignField: "_id",
          as: "medium",
        },
      },
      {
        $unwind: { path: "$medium", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "tags",
          localField: "size",
          foreignField: "_id",
          as: "size",
        },
      },
      {
        $unwind: { path: "$size", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: {
          isMainImage: -1,
          isFeatured: -1,
          isCategoryImage: -1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const { metadata, data } = aggregateQueryResult[0];
    console.log("Metadata:", metadata[0].totalCount);

    const totalPages = Math.ceil(metadata[0].totalCount / 10);

    const artworkDocuments: PopulatedArtworkDocument[] = JSON.parse(
      JSON.stringify(data)
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
            totalPages={totalPages}
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
