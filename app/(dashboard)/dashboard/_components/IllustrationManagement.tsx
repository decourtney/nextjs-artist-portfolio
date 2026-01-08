"use server";

import { Artwork } from "@/models";
import Image from "next/image";
import { IoAddCircleOutline, IoBookOutline } from "react-icons/io5";
import DraggableArtwork from "./DraggableArtwork";
import { PopulatedArtworkDocument } from "@/models/Artwork";
import DraggableContext from "./DraggableContext";
import DroppableArea from "./DroppableArea";
import DragTest from "./dragtest";

const IllustrationManagement = async () => {
  const queryResult = await Artwork.where("isIllustration").equals(true);
  const illustrationArtwork: PopulatedArtworkDocument[] = JSON.parse(
    JSON.stringify(queryResult)
  );

  return (
    <section
      id="file-management"
      className="relative bg-white space-y-6 p-6 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <IoBookOutline className="text-purple-600" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Illustration Management
            </h2>
            <p className="text-sm text-gray-500">Manage your Illustrations</p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Total:{" "}
          <span className="font-semibold">{illustrationArtwork.length}</span>{" "}
          items
        </div>
      </div>

      {/* Illustration Content */}
      <DragTest artwork={illustrationArtwork} />
      {/* <DraggableContext>
        <div className="bg-gray-50 p-6 space-y-6 rounded-xl border border-gray-200">
          Unassigned Artwork
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">
              Unassigned Artwork
            </label>
              <div className="flex flex-row gap-2 p-4 bg-white rounded-xl border border-gray-200 overflow-x-auto">
                {illustrationArtwork.map((file) => (
                  <DraggableArtwork key={file._id} fileId={file._id}>
                    <div
                      key={file._id}
                      className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={file.thumbSrc}
                        alt={file.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="object-cover"
                      />
                    </div>
                  </DraggableArtwork>
                ))}
              </div>
          </div>

          Illustrations
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Illustrations
            </h3>
            <DroppableArea>
              <div className="flex flex-row p-6 w-full h-32 bg-white rounded-xl border border-gray-200"></div>
            </DroppableArea>
          </div>
        </div>
      </DraggableContext> */}
    </section>
  );
};

export default IllustrationManagement;
