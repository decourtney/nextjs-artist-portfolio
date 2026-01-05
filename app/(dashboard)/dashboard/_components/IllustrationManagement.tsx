"use server";

import { Artwork } from "@/models";
import { IoBookOutline } from "react-icons/io5";

const IllustrationManagement = async () => {
  const illustrationArtwork = await Artwork.where("isIllustration").equals(true)

  if (illustrationArtwork)
    console.log("Illustration Artwork:", illustrationArtwork.length);

  return (
    <section
      id="file-management"
      className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200"
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
          {/* Total: <span className="font-semibold">{files.length}</span> items */}
        </div>
      </div>
    </section>
  );
};

export default IllustrationManagement;
