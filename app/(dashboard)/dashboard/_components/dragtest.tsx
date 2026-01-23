"use client";

import { FormEvent, useRef, useState } from "react";
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
import Image from "next/image";
import {
  ArtworkObj,
  IllustrationObj,
} from "../../utils/getIllustrationsForClient";

interface DragTestProps {
  illustrationRecords: Record<string, IllustrationObj>;
  artworkRecords: Record<string, ArtworkObj>;
}
5;

const DragTest = ({ illustrationRecords, artworkRecords }: DragTestProps) => {
  const [activeId, setActiveId] = useState<null | string>(null);
  const [recordsContainer, setRecordsContainer] = useState(illustrationRecords);
  const { key: unassignedKey, record: unassignedRecord } =
    getUnassignedRecord(recordsContainer); // unassigned record is rendered separate from others

  // Helper to safely get the Unassigned record
  function getUnassignedRecord(container: Record<string, IllustrationObj>) {
    const key = Object.keys(container).find(
      (k) => container[k].name === "Unassigned"
    );
    if (!key) throw new Error("Unassigned container not found");
    return { key, record: container[key] };
  }

  // Create non-presisted illustration record entry in recordsContainer state
  function addNewIllustrationRecord() {
    const tempId = crypto.randomUUID();
    const name = "New Illustration";

    setRecordsContainer((prev) => ({
      ...prev,
      [tempId]: {
        id: tempId,
        name,
        artworkIds: [],
        isPersisted: false,
        isDirty: true,
      },
    }));
  }

  function updateIllustrationRecord(
    id: string,
    patch: Partial<IllustrationObj>
  ) {
    setRecordsContainer((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  }

  async function saveIllustrationRecordToDB(record: IllustrationObj) {
    if (!record.isPersisted && !record.isDirty) {
      return null;
    }

    const payload = sanitizeIllustration(record);

    try {
      let res;

      if (!record.isPersisted) {
        res = await fetch(`/api/illustration`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (record.isDirty) {
        res = await fetch(`/api/illustration/${record.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res) return null;
      if (!res.ok) {
        throw new Error(`Save failed with status ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error saving illustration:", err);
      throw err;
    }
  }

  function applySavedRecord(record: IllustrationObj){
    console.log("applying record to state")
  }

  function sanitizeIllustration(record: IllustrationObj) {
    const { isPersisted, isDirty, ...clean } = record;
    return clean;
  }

  // Uses the active, draggables Id to determine the dnd-kit droppable its currently over
  function findDroppableRecord(id: UniqueIdentifier) {
    // Check if id is a record itself
    if (id in recordsContainer) {
      return id as string;
    }

    // Otherwise, find the record that contains this artwork ID
    return Object.keys(recordsContainer).find((key) =>
      recordsContainer[key].artworkIds.includes(id as string)
    );
  }

  // Once a draggable is being dragged set it as active
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  // ** DRAGOVER NOT CURRENTLY IN-USE **
  // DragOver works but current implementation has a minor drawback: The sortable item is inserted into a hovered droppable
  // which removes the item from the original droppable. So if the user 'cancels' the move by dropping the
  // item outside any droppable areas then the item remains in the last hovered droppable rather than resetting to its
  // original droppable area.
  // Leaving this in case the user perfers this action or I get around to fixing the bug.
  // This could also be due to my lack of experience with dnd-kit.
  // function handleDragOver(event: DragOverEvent) {
  //   const { active, over } = event;

  //   if (!over) return;

  //   const activeId = active.id as string;
  //   const overArtworkId = over.id as string;

  //   const activeContainer = findContainer(activeId);
  //   const overContainer = findContainer(overArtworkId);

  //   if (
  //     !activeContainer ||
  //     !overContainer ||
  //     activeContainer === overContainer
  //   ) {
  //     return;
  //   }

  //   setContainer((prev) => {
  //     const activeItems = prev[activeContainer];
  //     const overRecordArtworkIds = prev[overContainer];

  //     const activeIndex = activeItems.indexOf(activeId);
  //     const overIndex = overRecordArtworkIds.indexOf(overArtworkId);

  //     return {
  //       ...prev,
  //       [activeContainer]: activeItems.filter((id) => id !== activeId),
  //       [overContainer]: [
  //         ...overRecordArtworkIds.slice(
  //           0,
  //           overIndex >= 0 ? overIndex + 1 : overRecordArtworkIds.length
  //         ),
  //         activeId,
  //         ...overRecordArtworkIds.slice(overIndex >= 0 ? overIndex + 1 : overRecordArtworkIds.length),
  //       ],
  //     };
  //   });
  // }

  // I could be doing this all wrong but it works.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeArtworkId = active.id as string;
    const overArtworkId = over.id as string;

    const activeRecord = findDroppableRecord(activeArtworkId);
    const overRecord = findDroppableRecord(overArtworkId);

    if (!activeRecord || !overRecord) {
      setActiveId(null);
      return;
    }

    const activeRecordArtworkIds = recordsContainer[activeRecord].artworkIds;

    // Sorting within the same record
    if (activeRecord === overRecord) {
      const oldIndex = activeRecordArtworkIds.indexOf(activeArtworkId);
      const newIndex = activeRecordArtworkIds.indexOf(overArtworkId);

      const newArtworkIdsOrder = arrayMove(
        activeRecordArtworkIds,
        oldIndex,
        newIndex
      );

      if (oldIndex !== newIndex) {
        setRecordsContainer((prev) => ({
          ...prev,
          [activeRecord]: {
            ...prev[activeRecord],
            artworkIds: newArtworkIdsOrder,
          },
        }));
      }
    } else {
      // Moving between recordsContainer
      const overRecordArtworkIds = recordsContainer[overRecord].artworkIds;
      const rawIndex = overRecordArtworkIds.indexOf(overArtworkId);
      const overIndex =
        rawIndex === -1 ? overRecordArtworkIds.length : rawIndex;

      overRecordArtworkIds.splice(overIndex, 0, activeArtworkId);

      setRecordsContainer((prev) => ({
        ...prev,
        [activeRecord]: {
          ...prev[activeRecord],
          artworkIds: activeRecordArtworkIds.filter(
            (id) => id !== activeArtworkId
          ),
        },
        [overRecord]: {
          ...prev[overRecord],
          artworkIds: overRecordArtworkIds,
        },
      }));
    }

    setActiveId(null);
  }

  // function deleteCollection(collectionId: string) {
  //   const itemsToReturn = recordsContainer[collectionId];
  //   const newContainers = { ...recordsContainer };
  //   delete newContainers[collectionId];

  //   setContainer({
  //     ...newContainers,
  //     unassigned: [...newContainers.unassigned, ...itemsToReturn],
  //   });
  // }

  // function saveCollection(collectionId: string) {
  //   const items = recordsContainer[collectionId];
  //   console.log(`Saving ${collectionId}:`, items);
  //   alert(`Collection saved with ${items.length} items: ${items.join(", ")}`);
  // }

  // function saveCollection(event: FormEvent) {
  //   event.preventDefault();

  //   console.log(event);
  //   const items = recordsContainer[collectionId];
  //   console.log(`Saving ${collectionId}:`, items);
  //   alert(`Collection saved with ${items.length} items: ${items.join(", ")}`);
  // }

  return (
    <DndContext
      onDragStart={handleDragStart}
      // onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <section className="bg-gray-50 p-6 space-y-6 rounded-xl border border-gray-200 max-w-6xl mx-auto">
        {/* Unassigned Artwork */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Unassigned Artwork ({unassignedRecord.artworkIds.length})
          </label>

          <DroppableArea id={unassignedKey} items={unassignedRecord.artworkIds}>
            {unassignedRecord.artworkIds.length === 0 ? (
              <p className="text-gray-400 text-sm w-full text-center">
                No unassigned artwork
              </p>
            ) : (
              unassignedRecord.artworkIds.map((id) => {
                const artwork = artworkRecords[id];
                return (
                  <SortableItem key={id} id={id}>
                    <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={artwork.thumbSrc}
                        alt={artwork.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
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
              Illustrations (
              {
                Object.values(recordsContainer).filter(
                  (value) => value.name !== "Unassigned"
                ).length
              }
              )
            </h3>
            <button
              onClick={addNewIllustrationRecord}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              + New Illustration
            </button>
          </div>

          {Object.values(recordsContainer).filter(
            (value) => value.name !== "Unassigned"
          ).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No collections yet. Click "New Collection" to create one.
            </p>
          ) : (
            Object.values(recordsContainer)
              .filter((value) => value.name !== "Unassigned")
              .map((recordsContainer) => (
                <div key={recordsContainer.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      <input
                        id={recordsContainer.id}
                        value={recordsContainer.name}
                        size={Math.max(recordsContainer.name.length, 20)}
                        onChange={(event) =>
                          updateIllustrationRecord(recordsContainer.id, {
                            name: event.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                          }
                        }}
                        onBlur={(event) =>
                          updateIllustrationRecord(recordsContainer.id, {
                            name: event.target.value,
                          })
                        }
                      />
                      <span className="text-md font-medium text-gray-700">
                        ({recordsContainer.artworkIds.length})
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          saveIllustrationRecordToDB(recordsContainer)
                        }
                        disabled={!recordsContainer.isDirty}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        // onClick={() => deleteCollection(collectionId)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <DroppableArea
                    id={recordsContainer.id}
                    items={recordsContainer.artworkIds}
                  >
                    {recordsContainer.artworkIds.length === 0 ? (
                      <p className="text-gray-400 text-sm w-full text-center">
                        Drag artwork here to add to collection
                      </p>
                    ) : (
                      recordsContainer.artworkIds.map((id) => {
                        const artwork = artworkRecords[id];
                        return (
                          <SortableItem key={id} id={id}>
                            <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                              <Image
                                src={artwork.thumbSrc}
                                alt={artwork.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 160px"
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
      </section>

      <DragOverlay>
        {activeId ? (
          <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 shadow-lg rotate-3">
            <Image
              src={artworkRecords[activeId].thumbSrc}
              alt={artworkRecords[activeId].name}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragTest;
