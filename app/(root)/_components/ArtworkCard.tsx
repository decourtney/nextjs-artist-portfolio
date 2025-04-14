"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import Image from "next/image";
import React from "react";

interface ArtworkCardProps {
  artwork: PopulatedArtworkDocument;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  return (
    <>
      <div className="lg:col-start-2 w-full">
        <div className="flex lg:hidden flex-col mb-2 px-4 text-tiny leading-3">
          <h3 className="text-lg font-bold text-gray-800">{artwork.name}</h3>
          <p>Substance on {artwork.medium?.label}</p>
        </div>

        <div className="md:hidden"></div>
        <Image
          src={artwork.thumbSrc}
          alt={artwork.name}
          width={600}
          height={450}
          className="w-full h-auto object-cover"
          priority={false}
        />
        <div className="flex justify-between mb-2 px-4 py-1 text-sm">
          <p>{artwork.size?.label}</p>
          <p>
            {artwork.isAvailable && artwork.price > 0
              ? `$${artwork.price.toFixed(2)}`
              : "Unavailable"}
          </p>
        </div>
      </div>

      <div className="flex flex-col mb-10 px-4 text-sm">
        <div className="hidden lg:flex flex-col mb-4 leading-3">
          <h3 className="text-lg font-bold text-gray-800">{artwork.name}</h3>
          <p>Substance on {artwork.medium?.label}</p>
        </div>

        <p>{artwork.description}</p>
      </div>
    </>
  );
};

export default ArtworkCard;
