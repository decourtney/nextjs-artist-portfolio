"use client";

import React, { useState, ChangeEvent, useRef, FormEvent } from "react";
import { MdClose } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { useRouter } from "next/navigation";
import { overlay, secondary } from "@/ColorTheme";
import LoadingSpinner from "./LoadingSpinner";
import { set } from "mongoose";

interface FileItem {
  id: string;
  file: File;
  name: string;
  status: "idle" | "error";
  errorMessage?: string;
}

interface ArtworkApiResponse {
  successes?: Array<{ id: string }>;
  failures?: Array<{ id: string; message?: string; error?: string }>;
}

const FileUpload = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfSuccesses, setNumberOfSuccesses] = useState<number | null>();
  const [numberOfFailures, setNumberOfFailures] = useState<number | null>();

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles((prev) => {
        const existingNameSizeSet = new Set(
          prev.map((fileItem) => `${fileItem.name}##${fileItem.file.size}`)
        );

        const filteredNewFiles = Array.from(event.target.files!)
          .filter((file) => {
            const nameSizeKey = `${file.name}##${file.size}`;
            return !existingNameSizeSet.has(nameSizeKey);
          })
          .map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            status: "idle" as const,
          }));

        return [...prev, ...filteredNewFiles];
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setSelectedFiles([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNumberOfSuccesses(null);
    setNumberOfFailures(null);

    if (selectedFiles.length === 0) {
      alert("Please select at least one file first.");
      return;
    }

    setIsLoading(true);

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

      const data = (await response.json()) as ArtworkApiResponse;

      if (data.successes && data.successes.length > 0) {
        setNumberOfSuccesses(data.successes.length);
        setSelectedFiles((prev) =>
          prev.filter(
            (fileItem) => !data.successes!.some((s) => s.id === fileItem.id)
          )
        );
      }

      if (data.failures && data.failures.length > 0) {
        setNumberOfFailures(data.failures.length);
        setSelectedFiles((prev) =>
          prev.map((fileItem) => {
            const failure = data.failures!.find((f) => f.id === fileItem.id);
            if (failure) {
              return {
                ...fileItem,
                status: "error",
                errorMessage: failure.message || failure.error,
              };
            }
            return fileItem;
          })
        );
      }

      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error uploading files");
    }
  };

  return (
    <form
      id="file-upload"
      onSubmit={handleSubmit}
      className="relative p-6 shadow-md rounded-lg bg-background-50 text-gray-900"
    >
      <div className="flex mb-4 pb-4 border-b">
        <h1 className="mr-6 text-2xl font-bold text-foreground-500">
          Upload Image
        </h1>

        <div className="flex flex-grow h-full">
          {numberOfFailures && (
            <div className="w-full p-1 text-center bg-red-100 text-red-700 rounded-md">
              {numberOfFailures > 1 ? `${numberOfFailures} files failed to upload.` : "File failed to upload."}
            </div>
          )}

          {numberOfSuccesses && (
            <div className="w-full p-1 text-center bg-green-100 text-green-700 rounded-md">
              {numberOfSuccesses > 1 ? `${numberOfSuccesses} files` : "File"} uploaded successfully.
            </div>
          )}
        </div>

        {selectedFiles.length > 0 ? (
          <h3 className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
            <span>{selectedFiles.length} </span>File
            {selectedFiles.length > 1 ? <span>s</span> : null} Selected
          </h3>
        ) : null}
      </div>
      <input
        id="file-input"
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {isLoading && <LoadingSpinner />}

      <div className="relative min-h-[200px] max-h-[500px] overflow-y-auto rounded-lg bg-white shadow-sm">
        {selectedFiles.length > 0 ? (
          <>
            <ul className="[&>*:nth-child(even)]:bg-gray-50 text-gray-900">
              {selectedFiles.map((item, index) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center pr-1 pl-2 py-1"
                >
                  <p className="truncate">{item.name}</p>

                  <div className="flex items-center space-x-2">
                    {item.status === "error" && item.errorMessage ? (
                      <span className="px-2 py-1 rounded-full text-red-800 bg-red-100 text-xs whitespace-nowrap flex items-center">
                        <IoIosWarning className="mr-1" />
                        {item.errorMessage}
                      </span>
                    ) : null}
                    <div className="border-l-2">
                      <button
                        type="button"
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-900"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <MdClose />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="h-[200px] content-center flex items-center justify-center text-gray-500">
            <span className="text-sm">No files selected</span>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          onClick={handleOpenFileDialog}
        >
          Choose Files
        </button>

        <div className="space-x-4">
          <button
            type="button"
            disabled={selectedFiles.length === 0 || isLoading}
            className="px-4 py-2 text-sm bg-secondary-700 hover:bg-secondary-900 text-white rounded-md transition-colors"
            style={{
              backgroundColor:
                selectedFiles.length === 0 ? overlay[100] : undefined,
            }}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={selectedFiles.length === 0 || isLoading}
            className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            style={{
              backgroundColor:
                selectedFiles.length === 0 ? overlay[100] : undefined,
            }}
          >
            Upload
          </button>
        </div>
      </div>
    </form>
  );
};

export default FileUpload;
