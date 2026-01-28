import React from "react";
import DroppableArea from "./DroppableArea";
import SortableItem from "./SortableItem";
import {
  ArtworkObj,
  IllustrationObj,
} from "../../utils/getIllustrationsForClient";
import Image from "next/image";
import IllustrationItem from "./IllustrationItem";

interface UnassignedArtworkSectionProps {
  unassigned: IllustrationObj;
  artworks: Record<string, ArtworkObj>;
}

const UnassignedArtworkSection = ({
  unassigned,
  artworks,
}: UnassignedArtworkSectionProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Unassigned Artwork ({unassigned.artworkIds.length})
      </label>

      <DroppableArea id={unassigned.id} items={unassigned.artworkIds}>
        {unassigned.artworkIds.length === 0 ? (
          <p className="text-gray-400 text-sm w-full text-center mt-4">
            No unassigned artwork
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
            {unassigned.artworkIds.map((id) => (
              <div className="col-span-1">
                <IllustrationItem key={id} item={artworks[id]} />
              </div>
            ))}
          </div>
        )}
      </DroppableArea>
    </div>
  );
};

export default UnassignedArtworkSection;
