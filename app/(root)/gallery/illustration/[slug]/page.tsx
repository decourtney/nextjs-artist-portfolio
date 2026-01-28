import React from "react";
import { notFound } from "next/navigation";
import { getIllustrationWithOrderedArtworks } from "@/app/(root)/utils/getIllustrationWithOrderedArtworks";
import IllustrationBook from "../../../_components/IllustrationBook";

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
