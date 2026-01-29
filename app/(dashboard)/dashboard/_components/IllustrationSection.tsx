import React from "react";
import {
  ArtworkObj,
  IllustrationObj,
} from "../../utils/getIllustrationsForClient";
import DroppableArea from "./DroppableArea";
import IllustrationItem from "./IllustrationItem";

interface IllustrationSectionProps {
  illustrations: IllustrationObj[];
  artworks: Record<string, ArtworkObj>;
  createTemp: () => void;
  update: (id: string, patch: Partial<IllustrationObj>) => void;
  saveAll: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const IllustrationSection = ({
  illustrations,
  artworks,
  createTemp,
  update,
  saveAll,
  remove,
}: IllustrationSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Illustrations ({illustrations.length})
        </h3>
        <button
          onClick={createTemp}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          + Create
        </button>
      </div>

      {illustrations.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No Illustrations yet. Click &quot;Create&quot; to create one.
        </p>
      ) : (
        illustrations.map((illustration) => (
          <div key={illustration.id} className="space-y-2">
            <div className="flex flex-col">
              <div className="space-x-2">
                <input
                  id={illustration.id}
                  value={illustration.name}
                  size={Math.max(illustration.name.length, 20)}
                  onChange={(event) =>
                    update(illustration.id, {
                      name: event.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  onBlur={(event) =>
                    update(illustration.id, {
                      name: event.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-between gap-2 w-full">
                <div className="text-md font-medium text-gray-700">
                  ({illustration.artworkIds.length})
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={saveAll}
                    disabled={!illustration.isDirty}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => remove(illustration.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <DroppableArea id={illustration.id} items={illustration.artworkIds}>
              {illustration.artworkIds.length === 0 ? (
                <p className="text-gray-400 text-sm w-full text-center mt-4">
                  Drag artwork here to add to Illustration
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                  {illustration.artworkIds.map((id) => (
                    <div key={id} className="col-span-1">
                      <IllustrationItem item={artworks[id]} />
                    </div>
                  ))}
                </div>
              )}
            </DroppableArea>
          </div>
        ))
      )}
    </div>
  );
};

export default IllustrationSection;
