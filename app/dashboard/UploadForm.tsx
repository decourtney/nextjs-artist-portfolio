"use client";

import React, { useState, ChangeEvent } from "react";
import { Button, ButtonGroup, Input } from "@heroui/react";

const UploadForm: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    // Clear all selected files
    setSelectedFiles([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default browser form submit
    event.preventDefault();

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
      // Clear the file list after successful upload
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      alert("Error uploading files");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto">
      <div className="w-fit">
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          // variant=""
          classNames={{
            label:"",
            input:["w-full cursor-pointer"],
            innerWrapper:"",
            inputWrapper:"",
          }}
        />
      </div>

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
        <ButtonGroup>
          {/* Cancel Button */}
          <Button variant="solid" color="danger" onPress={handleCancel}>
            Cancel
          </Button>
          {/* Submit (Upload) Button */}
          <Button type="submit">Upload</Button>
        </ButtonGroup>
      </div>
    </form>
  );
};

export default UploadForm;
