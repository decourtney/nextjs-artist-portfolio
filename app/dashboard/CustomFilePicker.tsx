"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Button } from "@heroui/react";

// Use a plain HTML input for the file picker, hidden via CSS.
// The rest of the UI (choose files, remove file, cancel, etc.) is fully customizable.

const CustomFilePicker = () => {
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
    <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto">
      {/* 1) Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* 2) Custom button to open the file picker */}
      <Button onPress={handleOpenFileDialog}>Choose Files</Button>

      {/* Display the list of selected file names with remove buttons */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3>Selected Files:</h3>
          <ul className="list-disc list-inside space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <Button
                  variant="solid"
                  color="danger"
                  onPress={() => handleRemoveFile(index)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center space-x-4 mt-4">
        {/* Cancel Button */}
        <Button variant="solid" color="danger" onPress={handleCancel}>
          Cancel
        </Button>

        {/* Submit (Upload) Button */}
        <Button type="submit">Upload</Button>
      </div>
    </form>
  );
};

export default CustomFilePicker;
