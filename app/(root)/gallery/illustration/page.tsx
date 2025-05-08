import React from "react";
import { Metadata } from "next";
import OpenBookCanvas from "../../_components/OpenBookCanvas";
import dbConnect from "@/lib/dbConnect";
import { Artwork } from "@/models";
import { ArtworkDocument } from "@/models/Artwork";

export const metadata: Metadata = {
  title: "Illustration Book | Gena Courtney",
  description:
    "A curated collection of illustrations will be available here soon. Stay tuned for an interactive experience.",
};

const IllustrationPage = async () => {
  await dbConnect();

  const data = (await Artwork.find({
    isIllustration: true,
  }).lean()) as unknown as ArtworkDocument[];
  const artworks = JSON.parse(JSON.stringify(data));

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

export default IllustrationPage;
