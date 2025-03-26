"use client";

import { PopulatedArtworkDocument } from "@/models/Artwork";
import { TagDocument } from "@/models/Tag";
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward, IoIosClose } from "react-icons/io";
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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
    console.log("Deleting files:", selectedIds);
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
    onOpen();
  };

  // Handle modal form submission (update artwork)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile || !editForm) return;
    console.log("Client Updating artwork: ", editingFile._id, editForm);
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
    onClose();
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
        <Checkbox
          size="sm"
          isSelected={isChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSelectItem(file._id, e.target.checked)
          }
        />
        <div className="flex w-full overflow-hidden">
          <Image
            src={file.thumbSrc}
            alt={file.name}
            removeWrapper
            radius="none"
            className="w-12 h-12 object-cover"
          />
          <div className="flex flex-col w-full h-full ml-2 gap-2 truncate">
            <div className="flex justify-between">
              <p className="truncate">{file.name}</p>
              <div className="flex items-center text-tiny">
                {file.metaWidth}
                <IoIosClose />
                {file.metaHeight}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-row text-tiny">
                {file.categories.length > 0 && (
                  <div className="px-2">
                    {file.categories.length}
                    <span className="ml-1">
                      {file.categories.length > 1 ? "Categories" : "Category"}
                    </span>
                  </div>
                )}

                {file.medium && (
                  <div className="border-l-1 px-2">{file.medium.label}</div>
                )}
                {file.size && (
                  <div className="border-l-1 px-2">
                    {file.size && file.size.label}
                  </div>
                )}
              </div>

              <Button
                variant="light"
                size="sm"
                onPress={() => handleEdit(file)}
                className="min-w-fit h-fit text-foreground-100"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="max-w-[800px] m-1 rounded-lg border-1 text-foreground-100 bg-background-50 shadow-md">
      <ul>
        <div className="flex justify-between items-center border-b-2 p-2">
          <Checkbox
            size="sm"
            isSelected={allSelected(files)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSelectAllColumn(files, e.target.checked)
            }
          >
            <span className="font-medium text-xs text-foreground-100">
              Select All
            </span>
          </Checkbox>

          <Button
            size="sm"
            color="danger"
            onPress={handleDelete}
            isDisabled={selectedIds.length === 0}
          >
            Delete Selected
          </Button>
        </div>
        {files.map(renderFileItem)}
      </ul>

      <div className="flex justify-center gap-2 p-2 items-center">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handlePrevious}
          isDisabled={currentPage === 1}
          className="text-foreground-100 text-lg"
        >
          <IoIosArrowBack />
        </Button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleNext}
          isDisabled={currentPage === totalPages}
          className="text-foreground-100 text-lg"
        >
          <IoIosArrowForward />
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        placement="auto"
        onOpenChange={onOpenChange}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <div className="bg-background-50 p-4 rounded shadow-lg">
              <ModalHeader className="flex flex-col text-tiny text-foreground-100 truncate">
                Editing <div className="text-lg">{editForm?.name}</div>
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={handleModalSubmit}
                  onReset={() => {
                    onClose();
                    setEditingFile(null);
                  }}
                  className="text-foreground-100"
                >
                  <div className="flex w-full">
                    <div className="mr-4">
                      <Image
                        removeWrapper
                        radius="none"
                        src={editForm?.thumbSrc}
                        alt={editForm?.name}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="w-full max-w-[800px] space-y-4">
                      <div className="flex flex-col space-y-4">
                        <Input
                          type="text"
                          label="Name"
                          value={editForm?.name || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm!,
                              name: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          label="Description"
                          value={editForm?.description || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm!,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex justify-between">
                        <CategoryDropDown
                          availableItems={tags.categories}
                          selectedItems={editForm?.categories || null}
                          onSelectionChange={(newSelected: string[]) =>
                            setEditForm({
                              ...editForm!,
                              categories: newSelected,
                            })
                          }
                        />

                        <MediumDropDown
                          availableItems={tags.mediums}
                          selectedItem={editForm?.medium || null}
                          onSelectionChange={(newSelected: string) =>
                            setEditForm({
                              ...editForm!,
                              medium: newSelected,
                            })
                          }
                        />

                        <SizeDropDown
                          availableItems={tags.sizes}
                          selectedItem={editForm?.size || null}
                          onSelectionChange={(newSelected: string) =>
                            setEditForm({
                              ...editForm!,
                              size: newSelected,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <ModalFooter className="w-full">
                    <div className="flex space-x-2">
                      <Button
                        type="reset"
                        variant="light"
                        className="text-foreground-100"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="light"
                        className="text-foreground-100"
                      >
                        Save
                      </Button>
                    </div>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
