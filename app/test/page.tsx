import React from "react";
import { Metadata } from "next";
import OpenBookCanvas from "./OpenBookCanvas";
import { Artwork } from "@/models";
import { ArtworkDocument, PopulatedArtworkDocument } from "@/models/Artwork";
import dbConnect from "@/lib/dbConnect";

export const metadata: Metadata = {
  title: "Interactive Art Book | Gena Courtney",
  description:
    "Browse through a collection of artwork in an interactive 3D book format.",
};

const TestPage = async () => {
  await dbConnect();

  const data = await Artwork.find({
    isIllustration: true,
  })
    .populate("substance")
    .populate("medium")
    .populate("size")
    .populate("category")
    .lean()
    .maxTimeMS(10000)
    .exec() as unknown as PopulatedArtworkDocument[];
  const artworks: PopulatedArtworkDocument[] = JSON.parse(JSON.stringify(data));

  return (
    <div className="flex justify-center items-center min-h-[calc(100dvh-196px)] p-4">
      <OpenBookCanvas artworks={artworks} />
    </div>
  );
};

export default TestPage;
