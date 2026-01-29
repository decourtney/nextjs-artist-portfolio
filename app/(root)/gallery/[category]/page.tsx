import ArtworkCard from "@/app/(root)/_components/ArtworkCard";
import dbConnect from "@/lib/dbConnect";
import { Artwork, Tag } from "@/models";
import { PopulatedArtworkDocument } from "@/models/Artwork";
import { ITag } from "@/models/Tag";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Gena Courtney",
};

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  await dbConnect();
  const { category } = params;

  const categoryDoc = (await Tag.findOne({
    label: category.replace("-", " "),
  })) as ITag;

  if (!categoryDoc) {
    return (
      <div className="text-center pt-24">
        That category doesn&apos;t exist
      </div>
    );
  }

  const rawArtworkDocs = (await Artwork.find({
    category: categoryDoc._id,
  })
    .populate("substance")
    .populate("medium")
    .populate("size")
    .populate("category")
    .lean()
    .exec()) as unknown as PopulatedArtworkDocument[];

  // Need to serialize the ObjectIds to string to pass to client components
  const artworks = rawArtworkDocs.map((artwork) => ({
    ...artwork,
    _id: artwork._id.toString(),
    substance: {
      ...artwork.substance,
      _id: artwork.substance?._id.toString(),
    },
    category: {
      ...artwork.category,
      _id: artwork.category?._id.toString(),
    },
    medium: {
      ...artwork.medium,
      _id: artwork.medium?._id.toString(),
    },
    size: {
      ...artwork.size,
      _id: artwork.size?._id.toString(),
    },
  })) as unknown as PopulatedArtworkDocument[];

  if (artworks.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-196px)] w-full flex items-center justify-center">
        No artworks found in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_600px_1fr] max-w-7xl mx-auto py-8 lg:gap-y-8">
      <div className="flex flex-col mb-8 px-4">
        <h1 className="text-3xl font-bold">{categoryDoc.label}</h1>
        <p className="text-sm text-gray-600 mt-2">{categoryDoc.description}</p>
      </div>

      {artworks.map((artwork) => (
        <ArtworkCard key={artwork._id} artwork={artwork} />
      ))}
    </div>
  );
};

export default CategoryPage;
