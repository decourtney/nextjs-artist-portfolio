import React from "react";
import { Metadata } from "next";
import OpenBookCanvas from "./OpenBookCanvas";
import { Artwork } from "@/models";
import { ArtworkDocument, PopulatedArtworkDocument } from "@/models/Artwork";
import dbConnect from "@/lib/dbConnect";
import { BookPage } from "@/types/global";

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
    
  const artworks: BookPage[] = JSON.parse(JSON.stringify(data));

  // Create special pages
  const specialPages: BookPage[] = [
    {
      type: "title",
      src: "images/bookcover.jpg",
      metaWidth: 1,
      metaHeight: 1,
    },
  ];

  // Prepend special pages to artworks
  const pagesWithSpecials = [...specialPages, ...artworks];

  return (
    <div className="flex justify-center items-center min-h-[calc(100dvh-196px)] p-4">
      <OpenBookCanvas pagesWithSpecials={pagesWithSpecials} />
    </div>
  );
};

export default TestPage;
