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
          <p className="text-gray-400 text-sm w-full text-center">
            No unassigned artwork
          </p>
        ) : (
          unassigned.artworkIds.map((id) => (
            <IllustrationItem key={id} item={artworks[id]} />
          ))
        )}
      </DroppableArea>
    </div>
  );
};

export default UnassignedArtworkSection;
