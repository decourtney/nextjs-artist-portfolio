"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { useSortable } from "@dnd-kit/sortable";
import Image from "next/image";
import { ReactNode } from "react";

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: id,
    });

  const style = transform
    ? {
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default SortableItem;
