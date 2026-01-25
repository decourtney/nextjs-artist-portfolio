import { useState } from "react";
import { IllustrationObj } from "./getIllustrationsForClient";

export function useIllustrationRecords(initial: Record<string, IllustrationObj>) {
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

  function sanitizeRecord(record: IllustrationObj) {
    const { isPersisted, isDirty, ...clean } = record;
    return clean;
  }

  async function remove(id: string) {
    if (records[id]) {
      // try {
        const res = await fetch(`/api/illustration/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!res) return null;
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(
            errorData?.message ?? "Failed to delete Illustration"
          );
        }

        const data = await res.json();

        removeFromState(data.id);
      // } catch (err) {
      //   if (err instanceof Error) {
      //     toast.error(err.message);
      //   }
      // }
    } else {
      removeFromState(id);
    }
  }

  async function save(record: IllustrationObj) {
    if (!record.isPersisted && !record.isDirty) {
      return null;
    }

    const payload = sanitizeRecord(record);

    // try {
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
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message ?? "Failed to save Illustration");
      }

      const data = await res.json();

      setRecords((prev) => {
        const next = { ...prev };

        if (record.id !== data.id) {
          delete next[record.id];
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
    // } catch (err) {
    //   if (err instanceof Error) {
    //     toast.error(err.message);
    //   }
    // }
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
