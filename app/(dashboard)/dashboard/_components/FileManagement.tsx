"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import EditModal from "./EditModal";
import FileItem from "./FileItem";
import { AllTags } from "@/types/allTags";
import { overlay } from "@/ColorTheme";

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
    try {
      const res = await fetch(`/api/artwork/batch-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      console.error("Error deleting files", error);
    }
  };

  const handleEdit = (file: PopulatedArtworkDocument) => {
    setFileToEdit(file);
    setIsModalOpen(true);
  };

  return (
    <section
      id="file-management"
      className="bg-background-50 p-6 rounded-lg shadow-md"
    >
      <div className="flex justify-between mb-4 pb-4 border-b">
        <h1 className="text-2xl font-bold text-foreground-500">
          File Management
        </h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="ml-4">
          <input
            id="select-all"
            type="checkbox"
            className="mr-2"
            checked={selectedIds.length === files.length && files.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span>Select All</span>
        </div>

        <button
          disabled={selectedIds.length === 0}
          className="h-fit px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
          style={{
            backgroundColor:
              selectedIds.length === 0 ? overlay[100] : undefined,
          }}
          onClick={handleDelete}
        >
          Delete Selected
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file) => (
          <FileItem
            key={file._id}
            file={file}
            handleSelectItem={handleSelectItem}
            handleEdit={handleEdit}
          />
        ))}
      </div>

      <div className="flex justify-center items-center w-full space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className={`p-2 rounded-full ${
            currentPage <= 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <IoIosArrowBack />
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className={`p-2 rounded-full ${
            currentPage >= totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <IoIosArrowForward />
        </button>
      </div>

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
