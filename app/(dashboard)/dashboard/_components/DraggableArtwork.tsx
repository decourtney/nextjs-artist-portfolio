"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";
import { ReactNode } from "react";

interface DraggableContextProps {
  id: string;
  children: ReactNode;
}

const DraggableArtwork = ({ id, children }: DraggableContextProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
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

export default DraggableArtwork;
