"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { PopulatedArtworkDocument } from "@/models/Artwork";
import SortableItem from "./SortableItem";
import DroppableArea from "./DroppableArea";

const DragTest = ({ artwork }: { artwork: PopulatedArtworkDocument[] }) => {
  const [activeId, setActiveId] = useState<null | string>(null);
  const [containers, setContainers] = useState<Record<string, string[]>>({
    unassigned: artwork.map((a) => a._id),
  });
  const [nextCollectionId, setNextCollectionId] = useState<number>(1);
  console.log(containers);

  function findContainer(id: UniqueIdentifier) {
    // Check if id is a container itself
    if (id in containers) {
      return id as string;
    }

    // Find which container has this item
    return Object.keys(containers).find((key) =>
      containers[key].includes(id as string)
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    // Moving between containers during drag
    setContainers((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      return {
        ...prev,
        [activeContainer]: activeItems.filter((id) => id !== activeId),
        [overContainer]: [
          ...overItems.slice(
            0,
            overIndex >= 0 ? overIndex + 1 : overItems.length
          ),
          activeId,
          ...overItems.slice(overIndex >= 0 ? overIndex + 1 : overItems.length),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log(over);
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    console.log("Active Container:", activeContainer);
    console.log("Over Container:", overContainer);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // Sorting within the same container
    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);

      if (oldIndex !== newIndex) {
        setContainers({
          ...containers,
          [activeContainer]: arrayMove(items, oldIndex, newIndex),
        });
      }
    } else {
      // Moving between containers
      const activeItems = containers[activeContainer];
      const overItems = containers[overContainer];

      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      setContainers({
        ...containers,
        [activeContainer]: activeItems.filter((id) => id !== activeId),
        [overContainer]: [
          ...overItems.slice(0, overIndex >= 0 ? overIndex : overItems.length),
          activeId,
          ...overItems.slice(overIndex >= 0 ? overIndex : overItems.length),
        ],
      });
    }

    setActiveId(null);
  }

  function addNewCollection() {
    const newId = `collection-${nextCollectionId}`;
    setContainers({
      ...containers,
      [newId]: [],
    });
    setNextCollectionId(nextCollectionId + 1);
  }

  function deleteCollection(collectionId: string) {
    const itemsToReturn = containers[collectionId];
    const newContainers = { ...containers };
    delete newContainers[collectionId];

    setContainers({
      ...newContainers,
      unassigned: [...newContainers.unassigned, ...itemsToReturn],
    });
  }

  function saveCollection(collectionId: string) {
    const items = containers[collectionId];
    console.log(`Saving ${collectionId}:`, items);
    alert(`Collection saved with ${items.length} items: ${items.join(", ")}`);
  }

  const getArtworkById = (id: string) => artwork.find((a) => a._id === id);
  const activeArtwork = activeId ? getArtworkById(activeId) : null;
  const collections = Object.keys(containers).filter(
    (key) => key !== "unassigned"
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-gray-50 p-6 space-y-6 rounded-xl border border-gray-200 max-w-6xl mx-auto">
        {/* Unassigned Artwork */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Unassigned Artwork ({containers.unassigned.length})
          </label>
          <DroppableArea id="unassigned" items={containers.unassigned}>
            {containers.unassigned.length === 0 ? (
              <p className="text-gray-400 text-sm w-full text-center">
                All artwork assigned
              </p>
            ) : (
              containers.unassigned.map((id) => {
                const file = getArtworkById(id);
                return (
                  <SortableItem key={id} id={id}>
                    <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={file?.thumbSrc}
                        alt={file?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SortableItem>
                );
              })
            )}
          </DroppableArea>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Collections ({collections.length})
            </h3>
            <button
              onClick={addNewCollection}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              + New Collection
            </button>
          </div>

          {collections.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No collections yet. Click "New Collection" to create one.
            </p>
          ) : (
            collections.map((collectionId) => (
              <div key={collectionId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-700">
                    {collectionId
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                    ({containers[collectionId].length})
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveCollection(collectionId)}
                      disabled={containers[collectionId].length === 0}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => deleteCollection(collectionId)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <DroppableArea
                  id={collectionId}
                  items={containers[collectionId]}
                >
                  {containers[collectionId].length === 0 ? (
                    <p className="text-gray-400 text-sm w-full text-center">
                      Drag artwork here to add to collection
                    </p>
                  ) : (
                    containers[collectionId].map((id) => {
                      const file = getArtworkById(id);
                      return (
                        <SortableItem key={id} id={id}>
                          <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                            <img
                              src={file?.thumbSrc}
                              alt={file?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </SortableItem>
                      );
                    })
                  )}
                </DroppableArea>
              </div>
            ))
          )}
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
