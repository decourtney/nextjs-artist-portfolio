"use client";

import React, { useEffect, useState } from "react";
import { ArtworkDocument } from "@/models/Artwork";
import { Image } from "@nextui-org/react";

const ArtworkDisplay = ({ artwork }: { artwork: ArtworkDocument }) => {
  if (!artwork) return <p>No artwork available.</p>;

  console.log("ArtworkDisplay", artwork);
  // TODO - Need larger images to test slide placement
  return <Image src={artwork.src} alt={artwork.name} />;
};

export default ArtworkDisplay;

// check gsap or framer-motion for animations on server side
