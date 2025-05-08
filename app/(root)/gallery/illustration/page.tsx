import dbConnect from "@/lib/dbConnect";
import { Artwork } from "@/models";
import { PopulatedArtworkDocument } from "@/models/Artwork";
import { Metadata } from "next";
import OpenBookCanvas from "@/app/(root)/_components/OpenBookCanvas";

export const metadata: Metadata = {
  title: "Interactive Art Book | Gena Courtney",
  description:
    "Browse through a collection of artwork in an interactive 3D book format.",
};

const TestPage = async () => {
  await dbConnect();

  const data = (await Artwork.find({
    isIllustration: true,
  })
    .populate("substance")
    .populate("medium")
    .populate("size")
    .populate("category")
    .lean()
    .maxTimeMS(10000)
    .exec()) as unknown as PopulatedArtworkDocument[];
  const artworks: PopulatedArtworkDocument[] = JSON.parse(JSON.stringify(data));

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100dvh-128px)]">
      <h1
        className="flex flex-col items-center font-charm mb-4 text-[#1e293b]"
        style={{
          textShadow:
            "-1px -1px 2px rgba(0, 0, 0, 0.1), 1px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <span className="text-3xl font-bold">Midnight</span>
        <span className="text-2xl font-semibold">at</span>
        <span className="text-6xl font-bold">Kyrie Eleison Castle</span>
      </h1>

      <OpenBookCanvas artworks={artworks} />
    </div>
  );
};

export default TestPage;
