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
      id: fileToEdit._id,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        ref={formRef}
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
        onSubmit={handleOnSubmit}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Artwork</h2>
          <button
            type={"button"}
            onClick={handleModalClose}
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
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
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
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
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
                  id="artwork-substance"
                  value={editFormData.substance}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      substance: e.target.value,
                    })
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
                  value={editFormData.medium}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, medium: e.target.value })
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
                  value={editFormData.size}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, size: e.target.value })
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
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      category: e.target.value,
                    })
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
                  placeholder={editFormData.price.toString()}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                  editFormData.isAvailable ? "text-blue-500" : "text-gray-300"
                }`}
                onClick={(e) =>
                  setEditFormData({
                    ...editFormData,
                    isAvailable: !editFormData.isAvailable,
                  })
                }
              >
                {editFormData.isAvailable ? (
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
                  editFormData.isMainImage ? "text-blue-500" : "text-gray-300"
                }`}
                onClick={(e) =>
                  setEditFormData({
                    ...editFormData,
                    isMainImage: !editFormData.isMainImage,
                  })
                }
              >
                {editFormData.isMainImage ? (
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
                  editFormData.isFeatured ? "text-blue-500" : "text-gray-300"
                }`}
                onClick={(e) =>
                  setEditFormData({
                    ...editFormData,
                    isFeatured: !editFormData.isFeatured,
                  })
                }
              >
                {editFormData.isFeatured ? (
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
                  editFormData.isCategoryImage
                    ? "text-blue-500"
                    : "text-gray-300"
                }`}
                onClick={(e) =>
                  setEditFormData({
                    ...editFormData,
                    isCategoryImage: !editFormData.isCategoryImage,
                  })
                }
              >
                {editFormData.isCategoryImage ? (
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
            type={"button"}
            onClick={handleModalClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>

          <button
            type={"submit"}
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
      </form>
    </div>
  );
};

export default EditModal;
