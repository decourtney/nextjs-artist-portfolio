import React from "react";
import ArtworkList from "./ArtworkList";
import ArtworkGrid from "./ArtworkGrid";
import { ArtworkDocument } from "@/models/Artwork";

// get params and perform fetch for art in category
const CategoryPage = async ({ params }: { params: { category: string } }) => {
  const data = await fetch(`http://localhost:3000/api/gallery/${params.category}`);
  const artwork: ArtworkDocument[] = [];
  return (
    <main className="min-h-dvh">
      <div className="w-3/4 mx-auto">
        {/* <ArtworkList /> */}
        <ArtworkGrid artwork={artwork} />
      </div>
    </main>
  );
};

export default CategoryPage;
