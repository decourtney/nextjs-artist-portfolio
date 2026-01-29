"use client";

import { useState } from "react";
import { IllustrationObj } from "./getIllustrationsForClient";
import {
  createIllustration,
  deleteIllustration,
  updateIllustration,
} from "@/lib/illustrationService";
import { toast } from "react-toastify";

export function useIllustrationRecords(
  initial: Record<string, IllustrationObj>,
) {
  const [records, setRecords] = useState(initial);

  // create non-persisted records
  function createTemp() {
    const tempId = crypto.randomUUID();
    const name = "New Illustration";

    setRecords((prev) => ({
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

  // update record in state
  function update(id: string, patch: Partial<IllustrationObj>) {
    setRecords((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
        isDirty: true,
      },
    }));
  }

  // remove record from state and release assigned artworkIds
  function removeFromState(id: string) {
    const releasedArtworkIds = records[id].artworkIds;

    setRecords((prev) => {
      const next = { ...prev };

      // remove record
      delete next[id];

      // add released artworkIds to unassigned record
      if (next["unassigned"]) {
        next["unassigned"] = {
          ...next["unassigned"],
          artworkIds: [...next["unassigned"].artworkIds, ...releasedArtworkIds],
        };
      }

      return next;
    });
  }

  // remove fields unecessary for db
  /* eslint-disable @typescript-eslint/no-unused-vars */
  function sanitizeIllustrationObject(illustration: IllustrationObj) {
    const { isPersisted, isDirty, ...clean } = illustration;
    return clean;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // remove the record from db and state if persisted otherwise just from state
  async function remove(id: string) {
    const record = records[id];

    // non-persisted record
    if (!record?.isPersisted) {
      removeFromState(id);
      return;
    }

    try {
      const data = await deleteIllustration(id);
      removeFromState(data.id);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete illustration");
      }
    }
  }

  // create document if not already persisted otherwise update
  async function save(illustration: IllustrationObj) {
    const payload = sanitizeIllustrationObject(illustration);

    try {
      const data = illustration.isPersisted
        ? await updateIllustration(payload)
        : await createIllustration(payload);

      setRecords((prev) => {
        const next = { ...prev };

        if (illustration.id !== data.id) {
          delete next[illustration.id];
        }

        next[data.id] = {
          id: data.id,
          name: data.name,
          artworkIds: data.artworkIds,
          isPersisted: true,
          isDirty: false,
        };

        return next;
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to save illustration");
      }
    }
  }

  // this is temp fix to ensure all modified records are persisted (ex. moving artwork)
  async function saveAll() {
    for (const record of Object.values(records)) {
      if (record.isDirty && record.id !== "unassigned") {
        await save(record);
      }
    }
  }

  return {
    records,
    setRecords,
    createTemp,
    update,
    remove,
    save,
    saveAll,
  };
}
