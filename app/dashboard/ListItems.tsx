"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@heroui/react";

interface Artwork {
  _id: string;
  name: string;
  size?: string;
}

interface ListOfFilesClientProps {
  files: Artwork[];
}

export default function ListItems({ files }: ListOfFilesClientProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Split files into two columns
  const midIndex = Math.ceil(files.length / 2);
  const leftFiles = files.slice(0, midIndex);
  const rightFiles = files.slice(midIndex);

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
    filesInColumn: Artwork[],
    isSelected: boolean
  ) => {
    setSelectedIds((prev) => {
      const columnIds = filesInColumn.map((file) => file._id);
      if (isSelected) {
        // Add all column ids that are not already selected
        const newIds = columnIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      } else {
        // Remove all column ids from the selection
        return prev.filter((id) => !columnIds.includes(id));
      }
    });
  };

  // Delete selected items (calls your API DELETE route)
  const handleDelete = async () => {
    console.log("Deleting files:", selectedIds);
    // For each selected file, call the delete endpoint.
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/artwork/${id}`, { method: "DELETE" });
        if (!res.ok) {
          console.error(`Failed to delete ${id}`, await res.json());
        }
      } catch (error) {
        console.error("Error deleting file", error);
      }
    }
    // Refresh the list after deletion
    router.refresh();
  };

  // Edit selected item (only works if exactly one item is selected)
  const handleEdit = () => {
    if (selectedIds.length !== 1) {
      alert("Please select exactly one item to edit.");
      return;
    }
    const id = selectedIds[0];
    console.log("Editing file:", id);
    // Navigate to your edit route or open an edit modal
  };

  // Render a single file item with a checkbox and file info
  const renderFileItem = (file: Artwork) => {
    const isChecked = selectedIds.includes(file._id);
    return (
      <li key={file._id} className="flex items-center border-b ">
        <Checkbox
          checked={isChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSelectItem(file._id, e.target.checked)
          }
        />
        <div className="overflow-hidden">
          <p className="text-lg overflow-hidden text-nowrap text-ellipsis">
            {file.name}
          </p>
          <div className="text-xs">{file.size}</div>
        </div>
      </li>
    );
  };

  // Helper to determine if all items in a column are selected
  const allSelected = (filesInColumn: Artwork[]) =>
    filesInColumn.every((file) => selectedIds.includes(file._id));

  return (
    <div className="flex flex-col m-4 text-foreground-100 bg-background-100">
      {/* Two columns for the file list */}
      <div className="grid grid-cols-2 gap-x-4">
        {/* Left Column */}
        <ul className="">
          <div className="flex items-center border-b-2 py-1">
            <Checkbox
              checked={allSelected(leftFiles)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSelectAllColumn(leftFiles, e.target.checked)
              }
            />
            <span className="font-semibold text-xs">Select All</span>
          </div>
          {leftFiles.map(renderFileItem)}
        </ul>
        {/* Right Column */}
        <ul>
          <div className="flex items-center border-b-2 border-background-300 mb-2 p-2">
            <Checkbox
              checked={allSelected(rightFiles)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSelectAllColumn(rightFiles, e.target.checked)
              }
            />
            <span className="ml-2 font-bold">Select All</span>
          </div>
          {rightFiles.map(renderFileItem)}
        </ul>
      </div>
      {/* Global Edit and Delete buttons */}
      <div className="flex justify-end space-x-4">
        <button
          className="btn btn-primary"
          onClick={handleEdit}
          disabled={selectedIds.length !== 1}
        >
          Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={selectedIds.length === 0}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
