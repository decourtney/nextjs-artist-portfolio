"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
  closestCorners,
} from "@dnd-kit/core";
import { PopulatedArtworkDocument } from "@/models/Artwork";
import DraggableArtwork from "./DraggableArtwork";
import DroppableArea from "./DroppableArea";
import SortableItem from "./SortableItem";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";

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
    console.log("active:", active);
    console.log("over:", over);

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeItemId = active.id;
    const overId = over.id;

    if (active.id !== over.id) {
      setUnassignedItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

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
          <SortableContext items={unassignedItems}>
            <DroppableArea id="unassigned">
              {unassignedItems.length === 0 ? (
                <p className="text-gray-400 text-sm w-full text-center">
                  All artwork assigned
                </p>
              ) : (
                unassignedItems.map((id) => {
                  const file = getArtworkById(id);
                  return (
                    <SortableItem key={id} id={id}>
                      <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={file.thumbSrc}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SortableItem>
                  );
                })
              )}
            </DroppableArea>
          </SortableContext>
        </div>

        {/* Collection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Illustrations Collection ({collectionItems.length})
          </h3>
          <SortableContext items={collectionItems}>
            <DroppableArea id="collection">
              {collectionItems.length === 0 ? (
                <p className="text-gray-400 text-sm w-full text-center">
                  Drag artwork here to add to collection
                </p>
              ) : (
                collectionItems.map((id) => {
                  const file = getArtworkById(id);
                  return (
                    <SortableItem key={id} id={id}>
                      <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={file.thumbSrc}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SortableItem>
                  );
                })
              )}
            </DroppableArea>
          </SortableContext>
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
