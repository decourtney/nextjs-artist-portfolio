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
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosHome,
  IoIosStar,
  IoIosImages,
} from "react-icons/io";
import Image from "next/image";
import FileItem from "./FileItem";

// Define a type for the editable fields.
export interface EditableArtwork {
  name: string;
  description: string;
  substance: string;
  medium: string;
  size: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isMainImage: boolean;
  isFeatured: boolean;
  isCategoryImage: boolean;
}

interface AllTags {
  substances: TagDocument[];
  mediums: TagDocument[];
  sizes: TagDocument[];
  categories: TagDocument[];
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
  const [editingDoc, setEditingDoc] = useState<PopulatedArtworkDocument | null>(
    null
  );
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
    setEditingDoc(file);
    setEditForm({
      name: file.name,
      description: file.description ?? undefined,
      substance: file.substance?.label ?? undefined,
      medium: file.medium?.label ?? undefined,
      size: file.size?.label ?? undefined,
      category: file.category?.label ?? undefined,
      price: file.price ?? undefined,
      isAvailable: file.isAvailable ?? true,
      isMainImage: file.isMainImage ?? false,
      isFeatured: file.isFeatured ?? false,
      isCategoryImage: file.isCategoryImage ?? false,
    });
    setIsModalOpen(true);
  };

  const handleSubmitEdit = async () => {
    if (!editingDoc || !editForm) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/artwork/${editingDoc._id}`, {
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

      router.refresh();
      closeEditModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
    setEditForm(null);
    setError(null);
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

            {/* Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Substance
                  <select
                    id="artwork-medium"
                    value={editForm.substance}
                    onChange={(e) =>
                      setEditForm({ ...editForm, substance: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Substance</option>
                    {tags.substances.map((tag) => (
                      <option key={tag._id} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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

            {/* Price and Availability */}
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                  <input
                    id="artwork-price"
                    type="number"
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
                <div
                  className={`ml-2 cursor-pointer ${
                    editForm.isAvailable ? "text-blue-500" : "text-gray-300"
                  }`}
                  onClick={(e) =>
                    setEditForm({
                      ...editForm,
                      isAvailable: !editForm.isAvailable,
                    })
                  }
                >
                  {editForm.isAvailable ? (
                    <div className="flex flex-row items-center space-x-2">
                      <IoIosCheckmarkCircle
                        className="text-green-500"
                        title="Available"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Available
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center space-x-2">
                      <IoIosCloseCircle
                        className="text-red-500"
                        title="Unavailable"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Radio buttons for Home page, featured, and category images */}
              <div className="flex flex-col justify-between">
                <div
                  className={`cursor-pointer ${
                    editForm.isMainImage ? "text-blue-500" : "text-gray-300"
                  }`}
                  onClick={(e) =>
                    setEditForm({
                      ...editForm,
                      isMainImage: !editForm.isMainImage,
                    })
                  }
                >
                  {editForm.isMainImage ? (
                    <div className="flex flex-row items-center space-x-2">
                      <IoIosHome
                        className="text-blue-500"
                        title="Home Page Image"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Home Page Image
                      </span>
                    </div>
                  ) : (
                    <div className="group flex flex-row items-center space-x-2">
                      <IoIosHome
                        className="text-gray-300 group-hover:text-blue-300"
                        title="Home Page Image"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300">
                        Home Page Image
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`cursor-pointer ${
                    editForm.isFeatured ? "text-blue-500" : "text-gray-300"
                  }`}
                  onClick={(e) =>
                    setEditForm({
                      ...editForm,
                      isFeatured: !editForm.isFeatured,
                    })
                  }
                >
                  {editForm.isFeatured ? (
                    <div className="flex flex-row items-center space-x-2">
                      <IoIosStar
                        className="text-yellow-500 fill-current"
                        title="Featured"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Featured Image
                      </span>
                    </div>
                  ) : (
                    <div className="group flex flex-row items-center space-x-2">
                      <IoIosStar
                        className="text-gray-300 group-hover:text-blue-300 fill-current"
                        title="Featured"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300">
                        Featured Image
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`cursor-pointer ${
                    editForm.isCategoryImage ? "text-blue-500" : "text-gray-300"
                  }`}
                  onClick={(e) =>
                    setEditForm({
                      ...editForm,
                      isCategoryImage: !editForm.isCategoryImage,
                    })
                  }
                >
                  {editForm.isCategoryImage ? (
                    <div className="flex flex-row items-center space-x-2">
                      <IoIosImages
                        className="text-purple-500"
                        title="Category Image"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Category Image
                      </span>
                    </div>
                  ) : (
                    <div className="group flex flex-row items-center space-x-2">
                      <IoIosImages
                        className="text-gray-300 group-hover:text-blue-300"
                        title="Category Image"
                        size={20}
                      />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300">
                        Category Image
                      </span>
                    </div>
                  )}
                </div>
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
    <section
      id="file-management"
      className="bg-background-50 p-6 rounded-lg shadow-md"
    >
      <div className="flex justify-between mb-4 border-b ">
        <h1 className="text-2xl font-bold text-foreground-500 mb-4">
          File Management
        </h1>
        <button
          onClick={handleDelete}
          className="h-fit px-4 py-2  text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
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
          checked={
            selectedIds.length === files.length && files.length > 0
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <span>Select All</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
      {renderEditModal()}
    </section>
  );
}
