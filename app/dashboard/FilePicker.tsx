"use client";

import React, { useState, ChangeEvent, useRef, FormEvent } from "react";
import { Button } from "@heroui/react";

interface FileItem {
  id: string; // A unique UUID for each file
  file: File;
  name: string;
  status: "idle" | "error";
  errorMessage?: string;
}

const FilePicker = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map((file) => ({
        id: crypto.randomUUID(), // A new UUID for each file
        file,
        name: file.name,
        status: "idle" as const,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setSelectedFiles([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one file first.");
      return;
    }

    // Build form data: each file + its UUID
    const formData = new FormData();
    selectedFiles.forEach((item) => {
      formData.append("files", item.file);
      formData.append("uuids", item.id);
    });

    try {
      const response = await fetch("/api/artwork", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // Expecting shape: { successes: [{ id, ... }], failures: [{ id, ... }] }
      const data = await response.json();
      console.log("Server response", data);

      // 1) Remove successful files by matching their UUID
      if (data.successes) {
        setSelectedFiles((prev) =>
          prev.filter(
            (fileItem) =>
              // Keep fileItem if it's NOT in successes
              !data.successes.some((s: any) => s.id === fileItem.id)
          )
        );
      }

      // 2) Mark failures in red by matching their UUID
      if (data.failures) {
        setSelectedFiles((prev) =>
          prev.map((fileItem) => {
            const failure = data.failures.find(
              (f: any) => f.id === fileItem.id
            );
            if (failure) {
              return {
                ...fileItem,
                status: "error",
                errorMessage: failure.error || failure.message,
              };
            }
            return fileItem;
          })
        );
      }

      alert("Upload completed. See highlights for success/fail status.");
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
      {/* Hidden <input type="file" /> */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="min-h-[200px] max-h-[500px] overflow-y-scroll text-center rounded-lg">
        {selectedFiles.length > 0 ? (
          <>
            <h3 className="px-4 py-1 bg-slate-200">Selected Files</h3>
            <ul className="[&>*:nth-child(even)]:bg-slate-200">
              {selectedFiles.map((item, index) => {
                const itemStyle =
                  item.status === "error" ? "text-red-700 font-bold" : "";

                return (
                  <li
                    key={item.id}
                    className={`flex justify-between items-center pr-1 pl-2 py-1 ${itemStyle}`}
                  >
                    <div className="truncate">
                      <span>{item.name}</span>
                      {item.status === "error" && item.errorMessage ? (
                        <span className="ml-2 text-xs font-medium">
                          ({item.errorMessage})
                        </span>
                      ) : null}
                    </div>

                    <Button
                      size="sm"
                      variant="solid"
                      color="danger"
                      onPress={() => handleRemoveFile(index)}
                    >
                      remove
                    </Button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="h-[200px] content-center flex items-center justify-center">
            <span>No files selected</span>
          </div>
        )}
      </div>

      <div className="flex justify-between p-2">
        <Button onPress={handleOpenFileDialog}>Choose Files</Button>

        <div className="space-x-4">
          <Button variant="solid" color="danger" onPress={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="success"
            disabled={selectedFiles.length === 0}
            className="disabled:bg-gray-400"
          >
            Upload
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FilePicker;
