"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { AllTags } from "@/types/allTags";
import { EditFormData } from "@/types/editFormData";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import {
  IoIosCheckmarkCircle,
  IoIosClose,
  IoIosCloseCircle,
  IoIosHome,
  IoIosImages,
  IoIosStar,
} from "react-icons/io";
import { oid } from "@/utils/objectIdToString";

interface EditModalParams {
  fileToEdit: PopulatedArtworkDocument | null;
  tags: AllTags;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const EditModal = ({ fileToEdit, tags, setIsModalOpen }: EditModalParams) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(() => {
    if (!fileToEdit) return null;
    return {
      id: oid(fileToEdit._id),
      name: fileToEdit.name,
      description: fileToEdit.description ?? undefined,
      substance: fileToEdit.substance?.label,
      medium: fileToEdit.medium?.label,
      size: fileToEdit.size?.label,
      category: fileToEdit.category?.label,
      price: fileToEdit.price,
      isAvailable: fileToEdit.isAvailable,
      isMainImage: fileToEdit.isMainImage,
      isFeatured: fileToEdit.isFeatured,
      isCategoryImage: fileToEdit.isCategoryImage,
      isIllustration: fileToEdit.isIllustration,
    };
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/artwork/${editFormData!.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update artwork");
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editFormData) return;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <form
        ref={formRef}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onSubmit={handleOnSubmit}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Artwork</h2>
            <p className="text-sm text-gray-500">
              Update artwork details and settings
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoIosClose size={28} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Basic Information
              </h3>

              <div>
                <label
                  htmlFor="artwork-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Artwork Name
                </label>
                <input
                  id="artwork-name"
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="artwork-description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="artwork-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a description for this artwork..."
                />
              </div>

              <div className="space-x-2">
                <input
                  id="isIllustration"
                  type="checkbox"
                  checked={editFormData.isIllustration}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      isIllustration: e.target.checked,
                    })
                  }
                />
                <label className="text-md font-medium text-gray-700 mb-2">
                  Part of an Illustration
                </label>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Categories & Tags
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="artwork-category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="artwork-category"
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {tags.categories.map((tag) => (
                      <option key={oid(tag._id)} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="artwork-size"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Size
                  </label>
                  <select
                    id="artwork-size"
                    value={editFormData.size}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, size: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    {tags.sizes.map((tag) => (
                      <option key={oid(tag._id)} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="artwork-substance"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Substance
                  </label>
                  <select
                    id="artwork-substance"
                    value={editFormData.substance}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        substance: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Substance</option>
                    {tags.substances.map((tag) => (
                      <option key={oid(tag._id)} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="artwork-medium"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Medium
                  </label>
                  <select
                    id="artwork-medium"
                    value={editFormData.medium}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        medium: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Medium</option>
                    {tags.mediums.map((tag) => (
                      <option key={oid(tag._id)} value={tag.label}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Pricing & Availability
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="artwork-price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price ($)
                  </label>
                  <input
                    id="artwork-price"
                    type="number"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditFormData({
                        ...editFormData,
                        isAvailable: !editFormData.isAvailable,
                      })
                    }
                    className={`
                      w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        editFormData.isAvailable
                          ? "bg-green-50 text-green-700 border-2 border-green-300 hover:bg-green-100"
                          : "bg-red-50 text-red-700 border-2 border-red-300 hover:bg-red-100"
                      }
                    `}
                  >
                    {editFormData.isAvailable ? (
                      <>
                        <IoIosCheckmarkCircle size={20} />
                        Available for Purchase
                      </>
                    ) : (
                      <>
                        <IoIosCloseCircle size={20} />
                        Not Available
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Display Options Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Display Options
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setEditFormData({
                      ...editFormData,
                      isMainImage: !editFormData.isMainImage,
                    })
                  }
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all border-2
                    ${
                      editFormData.isMainImage
                        ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                        : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <IoIosHome size={20} />
                  Home Page
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditFormData({
                      ...editFormData,
                      isFeatured: !editFormData.isFeatured,
                    })
                  }
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all border-2
                    ${
                      editFormData.isFeatured
                        ? "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                        : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <IoIosStar size={20} />
                  Featured
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditFormData({
                      ...editFormData,
                      isCategoryImage: !editFormData.isCategoryImage,
                    })
                  }
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all border-2
                    ${
                      editFormData.isCategoryImage
                        ? "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
                        : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <IoIosImages size={20} />
                  Category
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={handleModalClose}
            className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              px-6 py-2 font-medium rounded-lg transition-colors
              ${
                isSubmitting
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }
            `}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditModal;
