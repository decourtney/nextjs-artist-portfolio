"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Image from "next/image";
import {
  ArtworkObj,
  IllustrationObj,
} from "../../utils/getIllustrationsForClient";
import { useIllustrationRecords } from "../../utils/useIllustrationRecords";
import UnassignedArtworkSection from "./UnassignedArtworkSection";
import IllustrationSection from "./IllustrationSection";

interface DragTestProps {
  illustrationRecords: Record<string, IllustrationObj>;
  artworkRecords: Record<string, ArtworkObj>;
}

const IllustrationDND = ({
  illustrationRecords,
  artworkRecords,
}: DragTestProps) => {
  const [activeId, setActiveId] = useState<null | string>(null);
  const { records, setRecords, createTemp, update, remove, save, saveAll } =
    useIllustrationRecords(illustrationRecords);

  // separate unassigned and assigned records
  const unassigned = records["unassigned"];
  const illustrations = Object.values(records).filter(
    (r) => r.id !== "unassigned"
  );

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

    setRecords((prev) =>
      applyDrag(prev, active.id as string, over.id as string)
    );

    setActiveId(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <section className="bg-gray-50 p-6 space-y-6 rounded-xl border border-gray-200 max-w-6xl mx-auto">
        {unassigned && (
          <UnassignedArtworkSection
            unassigned={unassigned}
            artworks={artworkRecords}
          />
        )}

        <IllustrationSection
          illustrations={illustrations}
          artworks={artworkRecords}
          createTemp={createTemp}
          update={update}
          saveAll={saveAll}
          save={save}
          remove={remove}
        />
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

export default IllustrationDND;

function applyDrag(
  records: Record<string, IllustrationObj>,
  activeArtworkId: string,
  overArtworkId: string
): Record<string, IllustrationObj> {
  const findRecord = (artworkId: string) =>
    Object.keys(records).find((key) =>
      records[key].artworkIds.includes(artworkId)
    );

  const activeRecordId = findRecord(activeArtworkId);
  const overRecordId = findRecord(overArtworkId) ?? overArtworkId;

  if (!activeRecordId || !overRecordId) return records;

  const activeRecord = records[activeRecordId];
  const overRecord = records[overRecordId];

  if (activeRecordId === overRecordId) {
    const oldIndex = activeRecord.artworkIds.indexOf(activeArtworkId);
    const newIndex = activeRecord.artworkIds.indexOf(overArtworkId);

    if (oldIndex === newIndex) return records;

    return {
      ...records,
      [activeRecordId]: {
        ...activeRecord,
        artworkIds: arrayMove(activeRecord.artworkIds, oldIndex, newIndex),
        isDirty: true,
      },
    };
  }

  const nextActiveIds = activeRecord.artworkIds.filter(
    (id) => id !== activeArtworkId
  );

  const overIds = [...overRecord.artworkIds];
  const overIndex = overIds.indexOf(overArtworkId);
  const insertAt = overIndex === -1 ? overIds.length : overIndex;

  overIds.splice(insertAt, 0, activeArtworkId);

  return {
    ...records,
    [activeRecordId]: {
      ...activeRecord,
      artworkIds: nextActiveIds,
      isDirty: true,
    },
    [overRecordId]: {
      ...overRecord,
      artworkIds: overIds,
      isDirty: true,
    },
  };
}
