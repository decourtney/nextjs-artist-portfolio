"use client";

import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

interface DroppableAreaProps {
  id: string;
  children: ReactNode;
  items: string[];
}

const DroppableArea = ({ id, children, items }: DroppableAreaProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const style = {
    backgroundColor: isOver ? "#e0f2fe" : "#f8fafc",
    borderColor: isOver ? "#3b82f6" : "#e5e7eb",
    transition: "all 0.2s",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-row flex-wrap gap-2 p-4 w-full min-h-32 rounded-xl border-2 border-dashed"
    >
      <SortableContext items={items}>{children}</SortableContext>
    </div>
  );
};

export default DroppableArea;
