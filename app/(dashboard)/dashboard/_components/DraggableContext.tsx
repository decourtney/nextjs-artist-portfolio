"use client";

import { DndContext } from "@dnd-kit/core";
import { ReactNode, useState } from "react";

interface DraggableContextProps {
  id: string;
  children: ReactNode;
}

const DraggableContext = ({ id, children }: DraggableContextProps) => {
  const [activeId, setActiveId] = useState(null);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
};

export default DraggableContext;
