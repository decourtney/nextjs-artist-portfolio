"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoTrashOutline, IoImagesOutline } from "react-icons/io5";
import EditModal from "./EditModal";
import FileItem from "./FileItem";
import { AllTags } from "@/types/allTags";
import LoadingSpinner from "./LoadingSpinner";

export default function FileManagement({
  files,
  tags,
  currentPage,
  totalPages,
}: {
  files: PopulatedArtworkDocument[];
  tags: AllTags;
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fileToEdit, setFileToEdit] = useState<PopulatedArtworkDocument | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(`?page=${currentPage - 1}`);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      router.push(`?page=${currentPage + 1}`);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedIds((prev) => {
      if (isSelected) {
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  // Global Select All
  const handleSelectAll = (isSelected: boolean) => {
    setSelectedIds(isSelected ? files.map((file) => file._id) : []);
  };

  // Delete selected items
  const handleDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected item(s)?`)) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/artwork/batch-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete files");
      }

      setSelectedIds([]);
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting files", error);
      setIsLoading(false);
    }
  };

  const handleEdit = (file: PopulatedArtworkDocument) => {
    setFileToEdit(file);
    setIsModalOpen(true);
  };

  return (
    <section
      id="file-management"
      className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      {isLoading && <LoadingSpinner />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <IoImagesOutline className="text-purple-600" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              File Management
            </h2>
            <p className="text-sm text-gray-500">Manage your artwork images</p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{files.length}</span> items
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <input
            id="select-all"
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={selectedIds.length === files.length && files.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Select All
          </label>

          {selectedIds.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        <button
          disabled={selectedIds.length === 0}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
            ${
              selectedIds.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }
          `}
          onClick={handleDelete}
        >
          <IoTrashOutline size={18} />
          Delete Selected
        </button>
      </div>

      {/* File Grid */}
      {files.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {files.map((file) => (
            <FileItem
              key={file._id}
              file={file}
              isSelected={selectedIds.includes(file._id)}
              handleSelectItem={handleSelectItem}
              handleEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <IoImagesOutline size={48} className="mb-3 text-gray-300" />
          <p className="text-lg font-medium">No files found</p>
          <p className="text-sm">Upload some images to get started</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className={`
              flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                currentPage <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <IoIosArrowBack />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={`
              flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                currentPage >= totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            Next
            <IoIosArrowForward />
          </button>
        </div>
      )}

      {/* Editing Modal */}
      {isModalOpen && fileToEdit && (
        <EditModal
          fileToEdit={fileToEdit}
          tags={tags}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </section>
  );
}
