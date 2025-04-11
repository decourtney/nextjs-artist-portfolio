"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { TagDocument } from "@/models/Tag";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosClose,
  IoIosWarning,
} from "react-icons/io";
import Image from "next/image";

// Define a type for the editable fields.
export interface EditableArtwork {
  name: string;
  description: string;
  thumbSrc: string;
  medium: string;
  size: string;
  category: string;
  price: number;
  available: boolean;
}

interface AllTags {
  categories: TagDocument[];
  mediums: TagDocument[];
  sizes: TagDocument[];
}

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
  const [editingFile, setEditingFile] =
    useState<PopulatedArtworkDocument | null>(null);
  const [editForm, setEditForm] = useState<EditableArtwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Delete selected items (calls your API DELETE route)
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/artwork/batch-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        setSelectedIds([]); // Clear selected IDs after deletion
      }

      if (!res.ok) {
        console.error("Batch delete failed", await res.json());
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting files", error);
    }
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingFile(null);
    setEditForm(null);
    setError(null);
  };

  const handleEdit = (file: PopulatedArtworkDocument) => {
    setEditingFile(file);
    setEditForm({
      name: file.name,
      description: file.description || "",
      thumbSrc: file.thumbSrc,
      medium: file.medium?.label || "",
      size: file.size?.label || "",
      category: file.category?.label || "",
      price: file.price || 0,
      available: file.available ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmitEdit = async () => {
    if (!editingFile || !editForm) return;
    console.log(editForm);
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/artwork/${editingFile._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update artwork");
      }

      closeEditModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render a single file item with a checkbox, thumbnail, and an edit button.
  const renderFileItem = (file: PopulatedArtworkDocument) => {
    const isChecked = selectedIds.includes(file._id);
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
          onChange={(e) => handleSelectItem(file._id, e.target.checked)}
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
              <div className="text-tiny text-center text-gray-400">resolution</div>
            </div>
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
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
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!isModalOpen || !editForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Artwork</h2>
            <button
              onClick={closeEditModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoIosClose size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
                <input
                  id="artwork-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
                <textarea
                  id="artwork-description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medium
                  <select
                    id="artwork-medium"
                    value={editForm.medium}
                    onChange={(e) =>
                      setEditForm({ ...editForm, medium: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Medium</option>
                    {tags.mediums.map((tag) => (
                      <option key={tag._id} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                  <select
                    id="artwork-size"
                    value={editForm.size}
                    onChange={(e) =>
                      setEditForm({ ...editForm, size: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Size</option>
                    {tags.sizes.map((tag) => (
                      <option key={tag._id} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                  <select
                    id="artwork-category"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Category</option>
                    {tags.categories.map((tag) => (
                      <option key={tag._id} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                  <input
                    id="artwork-price"
                    type="number"
                    // value={editForm.price}
                    placeholder={editForm.price.toString()}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    className="w-full p-2 border rounded-md"
                  />
                </label>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    id="artwork-available"
                    type="checkbox"
                    checked={editForm.available}
                    onChange={(e) =>
                      setEditForm({ ...editForm, available: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Available
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={closeEditModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitEdit}
              disabled={isSubmitting}
              className={`
                px-4 py-2 bg-blue-500 text-white rounded-md
                ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }
              `}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background-50 p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4 border-b ">
        <h1 className="text-2xl font-bold text-foreground-500 mb-4">
          File Management
        </h1>
        <button
          onClick={handleDelete}
          className="h-fit px-2 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
          style={{ display: selectedIds.length > 0 ? "block" : "none" }}
        >
          Delete Selected
        </button>
      </div>

      <div className="flex items-center mb-4">
        <input
          id="select-all"
          type="checkbox"
          className="mr-2"
          checked={selectedIds.length === files.length && files.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <span>Select All</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {files.map((file) => (
          <div key={file._id}>{renderFileItem(file)}</div>
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
      {renderEditModal()}
    </div>
  );
}
