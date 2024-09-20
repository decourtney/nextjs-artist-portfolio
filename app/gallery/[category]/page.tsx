import React from "react";
import ArtworkGrid from "./ArtworkGrid";
import { ArtworkDocument } from "@/models/Artwork";

// get params and perform fetch for art in category
const CategoryPage = async ({ params }: { params: { category: string } }) => {
  const category = params.category;
  const artworkPerPage = 10;

  const res = await fetch(
    `http://localhost:3000/api/gallery/${category}?limit=${artworkPerPage}`
  );
  const data = await res.json();
  const artwork: ArtworkDocument[] = data.artwork;
  const hasMore: boolean = data.hasMore;
  return (
    <main className="min-h-dvh">
      <div className="w-3/4 mx-auto">
        <ArtworkGrid
          initialArtwork={artwork}
          category={category}
          limit={artworkPerPage}
          initialHasMore={hasMore}
        />
      </div>
    </main>
  );
};

export default CategoryPage;
