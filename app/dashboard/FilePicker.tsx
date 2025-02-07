"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Button } from "@heroui/react";

// Use a plain HTML input for the file picker, hidden via CSS.
// The rest of the UI (choose files, remove file, cancel, etc.) is fully customizable.

const FilePicker = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Reference the hidden <input type="file" /> so we can trigger it programmatically.
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleCancel = () => {
    setSelectedFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one file first.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/artwork", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      alert("Files uploaded successfully!");
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      alert("Error uploading files");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[800px] m-2 shadow-md rounded-md bg-slate-50"
    >
      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Display the list of selected file names with remove buttons */}
      <div className="min-h-[200px] max-h-[500px] overflow-y-scroll scrollbar-hide text-center rounded-lg">
        {selectedFiles.length > 0 ? (
          <>
            <h3 className="px-4 py-1 bg-slate-200">
              Selected Files
            </h3>
            <ul className="[&>*:nth-child(even)]:bg-slate-200">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center pr-1 pl-2 py-1"
                >
                  <span className="truncate">{file.name}</span>
                  <Button
                    size="sm"
                    variant="solid"
                    color="danger"
                    onPress={() => handleRemoveFile(index)}
                  >
                    remove
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="h-[200px] content-center">
            <span>No files selected</span>
          </div>
        )}
      </div>

      <div className="flex justify-between p-2">
        {/* Custom button to open the file picker */}
        <Button onPress={handleOpenFileDialog}>Choose Files</Button>

        <div className="space-x-4">
          {/* Cancel Button */}
          <Button variant="solid" color="danger" onPress={handleCancel}>
            Cancel
          </Button>
          {/* Submit (Upload) Button */}
          <Button type="submit" color="success" disabled={selectedFiles.length === 0} className="disabled:bg-gray-400">
            Upload
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FilePicker;
