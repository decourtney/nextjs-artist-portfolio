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

    </section>
  );
};

export default IllustrationManagement;
