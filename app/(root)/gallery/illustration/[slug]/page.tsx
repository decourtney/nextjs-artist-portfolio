import { Artwork } from "@/models";
import Illustration from "@/models/Illustration";
import { notFound } from "next/navigation";
import React from "react";
import { oid } from "@/utils/objectIdToString";
import { getIllustrationWithOrderedArtworks } from "@/app/(root)/utils/getIllustrationWithOrderedArtworks";
import IllustrationBook from "./IllustrationBook";

const IllustrationDisplay = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const illustration = await getIllustrationWithOrderedArtworks(slug);
  if (!illustration) notFound();

  return <IllustrationBook artworks={illustration.artworks} />;
};

export default IllustrationDisplay;
