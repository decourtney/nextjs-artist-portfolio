"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { TagDocument } from "@/models/Tag";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward, IoIosClose } from "react-icons/io";
import Image from "next/image";
import CategoryDropDown from "./CategoryDropDown";
import MediumDropDown from "./MediumDropDown";
import SizeDropDown from "./SizeDropDown";

// Define a type for the editable fields.
export interface EditableArtwork {
  name: string;
  description: string;
  thumbSrc: string;
  medium: string;
  size: string;
  categories: string[];
}

interface AllTags {
  categories: TagDocument[];
  mediums: TagDocument[];
  sizes: TagDocument[];
}

export default function FileList({
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

  // Handle "Select All" in a column
  const handleSelectAllColumn = (
    filesInColumn: PopulatedArtworkDocument[],
    isSelected: boolean
  ) => {
    setSelectedIds((prev) => {
      const columnIds = filesInColumn.map((file) => file._id);
      if (isSelected) {
        const newIds = columnIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      } else {
        return prev.filter((id) => !columnIds.includes(id));
      }
    });
  };

  // Delete selected items (calls your API DELETE route)
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/artwork/batch-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) {
        console.error("Batch delete failed", await res.json());
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting files", error);
    }
  };

  // Open the edit modal and populate form fields with the selected file's details.
  // Also extract the assigned category IDs from the populated categories field.
  const handleEdit = (file: PopulatedArtworkDocument) => {
    setEditingFile(file);
    setEditForm({
      name: file.name,
      description: file.description || "",
      thumbSrc: file.thumbSrc,
      medium: file.medium?.label,
      size: file.size?.label,
      categories: file.categories.map(
        (category: TagDocument) => category.label
      ),
    });
    setIsModalOpen(true);
  };

  // Handle modal form submission (update artwork)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile || !editForm) return;
    try {
      const res = await fetch(`/api/artwork/${editingFile._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        console.error("Update failed", await res.json());
      }
    } catch (error) {
      console.error("Error updating artwork", error);
    }
    setEditingFile(null);
    setIsModalOpen(false);
    router.refresh();
  };

  // Helper to determine if all items in a column are selected
  const allSelected = (filesInColumn: PopulatedArtworkDocument[]) =>
    filesInColumn.every((file) => selectedIds.includes(file._id));

  // Render a single file item with a checkbox, thumbnail, and an edit button.
  const renderFileItem = (file: PopulatedArtworkDocument) => {
    const isChecked = selectedIds.includes(file._id);
    return (
      <li key={file._id} className="flex flex-row p-2 border-b">
        <input
          type="checkbox"
          className="mr-2"
          checked={isChecked}
          onChange={(e) => handleSelectItem(file._id, e.target.checked)}
        />
        <div className="flex w-full overflow-hidden">
          <div className="w-24 h-24 relative">
            <Image
              src={file.thumbSrc}
              alt={file.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col w-full h-full ml-2 gap-2 truncate">
            <div className="flex justify-between">
              <p className="truncate">{file.name}</p>
              <div className="flex items-center text-sm">
                {file.metaWidth}
                <IoIosClose />
                {file.metaHeight}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-row text-sm">
                {file.categories.length > 0 && (
                  <div className="px-2">
                    {file.categories.length}
                    <span className="ml-1">
                      {file.categories.length > 1 ? "Categories" : "Category"}
                    </span>
                  </div>
                )}

                {file.medium && <div className="px-2">{file.medium.label}</div>}
                {file.size && (
                  <div className="px-2">{file.size && file.size.label}</div>
                )}
              </div>

              <button
                onClick={() => handleEdit(file)}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
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
            Page {currentPage} of {totalPages}
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

        {selectedIds.length > 0 && (
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Delete Selected
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, colIndex) => {
          const filesInColumn = files.filter((_, i) => i % 3 === colIndex);
          return (
            <div key={colIndex} className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={allSelected(filesInColumn)}
                  onChange={(e) =>
                    handleSelectAllColumn(filesInColumn, e.target.checked)
                  }
                />
                <span>Select All</span>
              </div>
              <ul className="space-y-2">
                {filesInColumn.map((file) => renderFileItem(file))}
              </ul>
            </div>
          );
        })}
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Edit Artwork
                  </Dialog.Title>
                  <form onSubmit={handleModalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editForm?.name || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={editForm?.description || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Medium
                      </label>
                      <MediumDropDown
                        availableItems={tags.mediums}
                        selectedItem={editForm?.medium || null}
                        onSelectionChange={(medium) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, medium } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Size
                      </label>
                      <SizeDropDown
                        availableItems={tags.sizes}
                        selectedItem={editForm?.size || null}
                        onSelectionChange={(size) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, size } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Categories
                      </label>
                      <CategoryDropDown
                        availableItems={tags.categories}
                        selectedItems={editForm?.categories || []}
                        onSelectionChange={(categories) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, categories } : null
                          )
                        }
                      />
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
