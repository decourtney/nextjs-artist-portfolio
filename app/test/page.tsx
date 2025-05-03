import React from "react";
import { Metadata } from "next";
import OpenBookCanvas from "./OpenBookCanvas";
import { Artwork } from "@/models";
import { ArtworkDocument } from "@/models/Artwork";
import dbConnect from "@/lib/dbConnect";

export const metadata: Metadata = {
  title: "Interactive Art Book | Gena Courtney",
  description:
    "Browse through a collection of artwork in an interactive 3D book format.",
};

const TestPage = async () => {
  await dbConnect();

  const data = (await Artwork.find({
    isIllustration: true,
  }).lean()) as unknown as ArtworkDocument[];
  const artworks = JSON.parse(JSON.stringify(data));

  // console.log("artworks", artworks);

  return (
    <div className="flex justify-center items-center min-h-[calc(100dvh-196px)] p-4">
      <OpenBookCanvas artworks={artworks} />
    </div>
  );
};

export default TestPage;
