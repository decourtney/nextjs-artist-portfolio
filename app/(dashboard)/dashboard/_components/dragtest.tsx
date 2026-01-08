"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { PopulatedArtworkDocument } from "@/models/Artwork";
import DraggableArtwork from "./DraggableArtwork";
import DroppableArea from "./DroppableArea";

// function DraggableArtwork({ id, children }) {
//   const { attributes, listeners, setNodeRef, transform, isDragging } =
//     useDraggable({
//       id: id,
//     });

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
//       {children}
//     </div>
//   );
// }

// function DroppableArea({ id, children }) {
//   const { isOver, setNodeRef } = useDroppable({
//     id: id,
//   });

//   const style = {
//     backgroundColor: isOver ? "#e0f2fe" : "#f8fafc",
//     borderColor: isOver ? "#3b82f6" : "#e5e7eb",
//     transition: "all 0.2s",
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="flex flex-row flex-wrap gap-2 p-4 w-full min-h-32 rounded-xl border-2 border-dashed"
//     >
//       {children}
//     </div>
//   );
// }

const DragTest = ({ artwork }: { artwork: PopulatedArtworkDocument[] }) => {
  const [activeId, setActiveId] = useState(null);
  const [unassignedItems, setUnassignedItems] = useState(
    artwork.map((a) => a._id)
  );
  const [collectionItems, setCollectionItems] = useState([]);

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeItemId = active.id;
    const overId = over.id;

    // Moving from unassigned to collection
    if (overId === "collection" && unassignedItems.includes(activeItemId)) {
      setUnassignedItems(unassignedItems.filter((id) => id !== activeItemId));
      setCollectionItems([...collectionItems, activeItemId]);
    }

    // Moving from collection back to unassigned
    if (overId === "unassigned" && collectionItems.includes(activeItemId)) {
      setCollectionItems(collectionItems.filter((id) => id !== activeItemId));
      setUnassignedItems([...unassignedItems, activeItemId]);
    }

    setActiveId(null);
  }

  const getArtworkById = (id: string) => artwork.find((a) => a._id === id);
  const activeArtwork = activeId ? getArtworkById(activeId) : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="bg-gray-50 p-6 space-y-6 rounded-xl border border-gray-200 mx-auto">
        {/* Unassigned Artwork */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Unassigned Artwork ({unassignedItems.length})
          </label>
          <DroppableArea id="unassigned">
            {unassignedItems.length === 0 ? (
              <p className="text-gray-400 text-sm w-full text-center">
                All artwork assigned
              </p>
            ) : (
              unassignedItems.map((id) => {
                const file = getArtworkById(id);
                return (
                  <DraggableArtwork key={id} id={id}>
                    <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={file.thumbSrc}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </DraggableArtwork>
                );
              })
            )}
          </DroppableArea>
        </div>

        {/* Collection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Illustrations Collection ({collectionItems.length})
          </h3>
          <DroppableArea id="collection">
            {collectionItems.length === 0 ? (
              <p className="text-gray-400 text-sm w-full text-center">
                Drag artwork here to add to collection
              </p>
            ) : (
              collectionItems.map((id) => {
                const file = getArtworkById(id);
                return (
                  <DraggableArtwork key={id} id={id}>
                    <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={file.thumbSrc}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </DraggableArtwork>
                );
              })
            )}
          </DroppableArea>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              console.log("Saving collection:", collectionItems);
              alert(`Collection saved with ${collectionItems.length} items`);
            }}
            disabled={collectionItems.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Save Collection
          </button>
        </div>
      </div>

      <DragOverlay>
        {activeArtwork ? (
          <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 shadow-lg rotate-3">
            <img
              src={activeArtwork.thumbSrc}
              alt={activeArtwork.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragTest;
