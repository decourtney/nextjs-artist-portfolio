import { PopulatedArtworkDocument } from "@/models/Artwork";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosHome,
  IoIosImages,
  IoIosStar,
  IoIosWarning,
} from "react-icons/io";

interface FileItemParams {
  file: PopulatedArtworkDocument;
  isSelected: boolean;
  handleSelectItem: (id: string, isSelected: boolean) => void;
  handleEdit: (file: PopulatedArtworkDocument) => void;
}

const FileItem = ({
  file,
  isSelected,
  handleSelectItem,
  handleEdit,
}: FileItemParams) => {
  const [isChecked, setIsChecked] = React.useState(false);

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const handleChange = (id: string, isSelected: boolean) => {
    setIsChecked(isSelected);
    handleSelectItem(id, isSelected);
  };

  return (
    <div
      className={`
        flex items-center p-4 border rounded-lg transition-all duration-200
        ${isChecked ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}
        hover:shadow-md
      `}
    >
      {/* Checkbox */}
      <input
        id={`checkbox-${file._id}`}
        type="checkbox"
        className="mr-4 focus:ring-blue-500"
        checked={isChecked}
        onChange={(e) => {
          handleChange(file._id, e.target.checked);
        }}
      />

      {/* Thumbnail */}
      <div className="w-32 h-32 mr-4 flex-shrink-0 relative">
        <Image
          src={file.thumbSrc}
          alt={file.name}
          fill
          sizes="100%"
          className="object-cover rounded-md shadow-sm"
        />
      </div>

      {/* File Details */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold truncate max-w-[70%]">
            {file.name}
          </h3>
          <div>
            <div className="text-sm text-gray-500 flex items-center">
              {file.metaWidth} × {file.metaHeight}
            </div>
            <div className="text-tiny text-center text-gray-400">
              resolution
            </div>
          </div>
        </div>

        {/* Metadata Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {file.size ? (
            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
              {file.size.label || "Unknown Size"}
            </span>
          ) : (
            <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
              <IoIosWarning className="mr-1" />
              Unknown Size
            </div>
          )}
          {file.category ? (
            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
              {file.category.label || "Uncategorized"}
            </span>
          ) : (
            <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
              <IoIosWarning className="mr-1" />
              Uncategorized
            </div>
          )}
          {file.substance ? (
            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
              {file.substance.label || "Unknown Substance"}
            </span>
          ) : (
            <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
              <IoIosWarning className="mr-1" />
              Unknown Substance
            </div>
          )}
          {file.medium ? (
            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
              {file.medium.label || "Unknown Medium"}
            </span>
          ) : (
            <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
              <IoIosWarning className="mr-1" />
              Unknown Medium
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {file.price > 0 ? `$${file.price.toFixed(2)}` : "Not for sale"}
          </div>

          {!file.description && (
            <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
              <IoIosWarning className="mr-1" />
              No Description
            </div>
          )}

          <button
            onClick={() => handleEdit(file)}
            className="
              px-3 py-1 text-sm 
              bg-blue-500 text-white 
              rounded-md 
              hover:bg-blue-600 
              transition-colors
            "
          >
            Edit
          </button>
        </div>

        <div className="flex space-x-2 mt-2">
          {/* Availability Icon */}
          {file.isAvailable ? (
            <IoIosCheckmarkCircle
              className="text-green-500"
              title="Available"
              size={20}
            />
          ) : (
            <IoIosCloseCircle
              className="text-red-500"
              title="Unavailable"
              size={20}
            />
          )}

          {/* Main Page Image Icon */}
          {file.isMainImage ? (
            <IoIosHome
              className="text-blue-500"
              title="Home Page Image"
              size={20}
            />
          ) : (
            <IoIosHome
              className="text-gray-300"
              title="Home Page Image"
              size={20}
            />
          )}

          {/* Featured Icon */}
          {file.isFeatured ? (
            <IoIosStar
              className="text-yellow-500 fill-current"
              title="Featured"
              size={20}
            />
          ) : (
            <IoIosStar
              className="text-gray-300 fill-current"
              title="Featured"
              size={20}
            />
          )}

          {/* Category Image Icon */}
          {file.isCategoryImage ? (
            <IoIosImages
              className="text-purple-500"
              title="Category Image"
              size={20}
            />
          ) : (
            <IoIosImages
              className="text-gray-300"
              title="Category Image"
              size={20}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileItem;
