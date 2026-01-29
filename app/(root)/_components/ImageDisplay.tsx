"use client";

import { IArtwork } from "@/models/Artwork";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { oid } from "@/utils/objectIdToString";

interface ImageDisplayProps {
  artworks: IArtwork[];
}

const ImageDisplay = ({ artworks }: ImageDisplayProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {artworks.map((artwork) => (
        <Link
          key={oid(artwork._id)}
          href={`/artwork/${artwork.name}`}
          className="group relative aspect-square overflow-hidden rounded-medium bg-background-200"
        >
          <Image
            src={artwork.thumbSrc}
            alt={artwork.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-medium">{artwork.name}</h3>
            <p className="text-white/80 text-small">{artwork.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ImageDisplay;
