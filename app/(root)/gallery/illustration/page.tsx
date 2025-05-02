import React from "react";
import { Metadata } from "next";
import OpenBookCanvas from "../../_components/OpenBookCanvas";

export const metadata: Metadata = {
  title: "Illustration Book | Gena Courtney",
  description:
    "A curated collection of illustrations will be available here soon. Stay tuned for an interactive experience.",
};

const IllustrationPage = () => {
  return (
    <div className="min-h-[calc(100dvh-196px)] p-0 bg-blue-300">
      <OpenBookCanvas />
    </div>
  );
};

export default IllustrationPage;
