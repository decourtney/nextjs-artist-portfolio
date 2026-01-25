"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import DroppableArea from "./DroppableArea";
import Image from "next/image";
import {
  ArtworkObj,
  IllustrationObj,
} from "../../utils/getIllustrationsForClient";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useIllustrationRecords } from "../../utils/useIllustrationRecords";

interface DragTestProps {
  illustrationRecords: Record<string, IllustrationObj>;
  artworkRecords: Record<string, ArtworkObj>;
}
5;

const IllustrationDND = ({
  illustrationRecords,
  artworkRecords,
}: DragTestProps) => {
  const [activeId, setActiveId] = useState<null | string>(null);
  const { records, setRecords, createTemp, update, remove, save, saveAll } =
    useIllustrationRecords(illustrationRecords);

  // Uses the active, draggables Id to determine the dnd-kit droppable its currently over
  function findDroppableRecord(id: UniqueIdentifier) {
    // Check if id is a record itself
    if (id in records) {
      return id as string;
    }

    // Otherwise, find the record that contains this artwork ID
    return Object.keys(records).find((key) =>
      records[key].artworkIds.includes(id as string)
    );
  }

  // Once a draggable is being dragged set it as active
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

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

    const activeRecordArtworkIds = records[activeRecord].artworkIds;

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
        setRecords((prev) => ({
          ...prev,
          [activeRecord]: {
            ...prev[activeRecord],
            artworkIds: newArtworkIdsOrder,
            isDirty: true,
          },
        }));
      }
    } else {
      // Moving between recordsContainer
      const overRecordArtworkIds = records[overRecord].artworkIds;
      const rawIndex = overRecordArtworkIds.indexOf(overArtworkId);
      const overIndex =
        rawIndex === -1 ? overRecordArtworkIds.length : rawIndex;

      overRecordArtworkIds.splice(overIndex, 0, activeArtworkId);

      setRecords((prev) => ({
        ...prev,
        [activeRecord]: {
          ...prev[activeRecord],
          artworkIds: activeRecordArtworkIds.filter(
            (id) => id !== activeArtworkId
          ),
          isDirty: true,
        },
        [overRecord]: {
          ...prev[overRecord],
          artworkIds: overRecordArtworkIds,
          isDirty: true,
        },
      }));
    }

    setActiveId(null);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className="bg-gray-50 p-6 space-y-6 rounded-xl border border-gray-200 max-w-6xl mx-auto">
        {/* Unassigned Artwork */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Unassigned Artwork (
            {records["unassigned"].artworkIds.length})
          </label>

          <DroppableArea
            id={records["unassigned"].id}
            items={records["unassigned"].artworkIds}
          >
            {records["unassigned"].artworkIds.length === 0 ? (
              <p className="text-gray-400 text-sm w-full text-center">
                No unassigned artwork
              </p>
            ) : (
              records["unassigned"].artworkIds.map((id) => {
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

        {/* Illustrations */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Illustrations (
              {
                Object.values(records).filter(
                  (value) => value.name !== "Unassigned"
                ).length
              }
              )
            </h3>
            <button
              onClick={createTemp}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              + New Illustration
            </button>
          </div>

          {Object.values(records).filter(
            (value) => value.name !== "Unassigned"
          ).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No Illustrations yet. Click "New Illustration" to create one.
            </p>
          ) : (
            Object.values(records)
              .filter((value) => value.name !== "Unassigned")
              .map((records) => (
                <div key={records.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      <input
                        id={records.id}
                        value={records.name}
                        size={Math.max(records.name.length, 20)}
                        onChange={(event) =>
                          update(records.id, {
                            name: event.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                          }
                        }}
                        onBlur={(event) =>
                          update(records.id, {
                            name: event.target.value,
                          })
                        }
                      />
                      <span className="text-md font-medium text-gray-700">
                        ({records.artworkIds.length})
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={saveAll}
                        disabled={!records.isDirty}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() =>
                          remove(records.id)
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <DroppableArea
                    id={records.id}
                    items={records.artworkIds}
                  >
                    {records.artworkIds.length === 0 ? (
                      <p className="text-gray-400 text-sm w-full text-center">
                        Drag artwork here to add to Illustration
                      </p>
                    ) : (
                      records.artworkIds.map((id) => {
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </DndContext>
  );
};

export default IllustrationDND;
