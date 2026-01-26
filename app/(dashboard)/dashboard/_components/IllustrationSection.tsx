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
          + New Illustration
        </button>
      </div>

      {illustrations.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No Illustrations yet. Click "New Illustration" to create one.
        </p>
      ) : (
        illustrations.map((illustration) => (
          <div key={illustration.id} className="space-y-2">
            <div className="flex justify-between items-center">
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
                <span className="text-md font-medium text-gray-700">
                  ({illustration.artworkIds.length})
                </span>
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

            <DroppableArea id={illustration.id} items={illustration.artworkIds}>
              {illustration.artworkIds.length === 0 ? (
                <p className="text-gray-400 text-sm w-full text-center">
                  Drag artwork here to add to Illustration
                </p>
              ) : (
                illustration.artworkIds.map((id) => (
                  <IllustrationItem key={id} item={artworks[id]} />
                ))
              )}
            </DroppableArea>
          </div>
        ))
      )}
    </div>
  );
};

export default IllustrationSection;
