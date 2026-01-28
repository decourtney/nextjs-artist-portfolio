import React from "react";
import GetInTouchSection from "../_components/GetInTouchSection";
import { Metadata } from "next";
import IllustrationSection from "../_components/IllustrationSection";
import CategorySection from "../_components/CategorySection";

export const metadata: Metadata = {
  title: "Gallery | Gena Courtney",
  description: `Explore Gena Courtney's diverse art gallery. Discover a range of artistic styles and the captivating 'Midnight at Kyrie Eleison Castle' illustration series.`,
};

const GalleryPage = async () => {
  return (
    <>
      <CategorySection />

      <IllustrationSection />

      <GetInTouchSection />
    </>
  );
};

export default GalleryPage;
