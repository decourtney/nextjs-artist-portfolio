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
import { IoPencilOutline } from "react-icons/io5";

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
        relative flex flex-col sm:flex-row gap-4 p-4 border-2 rounded-xl transition-all duration-200 bg-white
        ${
          isChecked
            ? "border-blue-400 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
      {/* Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          id={`checkbox-${file._id}`}
          type="checkbox"
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          checked={isChecked}
          onChange={(e) => {
            handleChange(file._id, e.target.checked);
          }}
        />
      </div>

      {/* Thumbnail */}
      <div className="w-full sm:w-40 h-40 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={file.thumbSrc}
          alt={file.name}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="object-cover"
        />
      </div>

      {/* File Details */}
      <div className="flex-grow min-w-0 flex flex-col">
        {/* Title and Resolution */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 truncate pr-2">
            {file.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-medium text-gray-700">
              {file.metaWidth} × {file.metaHeight}
            </div>
            <div className="text-xs text-gray-500">pixels</div>
          </div>
        </div>

        {/* Description */}
        {file.description ? (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {file.description}
          </p>
        ) : (
          <div className="mb-3 px-2 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md inline-flex items-center gap-1 w-fit">
            <IoIosWarning size={14} />
            No description
          </div>
        )}

        {/* Metadata Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {file.size ? (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200">
              {file.size.label}
            </span>
          ) : (
            <span className="px-2 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium rounded-md flex items-center gap-1">
              <IoIosWarning size={12} />
              No size
            </span>
          )}

          {file.category ? (
            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-200">
              {file.category.label}
            </span>
          ) : (
            <span className="px-2 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium rounded-md flex items-center gap-1">
              <IoIosWarning size={12} />
              No category
            </span>
          )}

          {file.substance && (
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-200">
              {file.substance.label}
            </span>
          )}

          {file.medium && (
            <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-200">
              {file.medium.label}
            </span>
          )}
        </div>

        {/* Illustration */}
        <div className="flex items-center mt-auto">
          {file.isIllustration ? (
            <>
              <IoIosCheckmarkCircle
                className="text-blue-500"
                title="Part of an illustration"
                size={16}
              />
              <span className="px-2 py-1 text-blue-700 text-xs font-medium">
                Illustration
              </span>
            </>
          ) : (
            <>
              <IoIosCloseCircle
                className="text-gray-300"
                title="Not part of an illustration"
                size={16}
              />
              <span className="px-2 py-1 text-gray-300 text-xs font-medium">
                Illustration
              </span>
            </>
          )}
        </div>

        {/* Bottom Row: Price, Status Icons, Edit Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Price */}
            <div className="text-sm font-semibold text-gray-800">
              {file.price > 0 ? `$${file.price.toFixed(2)}` : "Not for sale"}
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-2">
              {file.isAvailable ? (
                <IoIosCheckmarkCircle
                  className="text-green-500"
                  title="Available for purchase"
                  size={20}
                />
              ) : (
                <IoIosCloseCircle
                  className="text-red-500"
                  title="Not available"
                  size={20}
                />
              )}

              {file.isMainImage && (
                <IoIosHome
                  className="text-blue-500"
                  title="Home page image"
                  size={20}
                />
              )}

              {file.isFeatured && (
                <IoIosStar
                  className="text-yellow-500 fill-current"
                  title="Featured image"
                  size={20}
                />
              )}

              {file.isCategoryImage && (
                <IoIosImages
                  className="text-purple-500"
                  title="Category image"
                  size={20}
                />
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => handleEdit(file)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <IoPencilOutline size={16} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileItem;
