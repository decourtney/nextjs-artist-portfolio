"use client";

import React, { useState, ChangeEvent, useRef, FormEvent } from "react";
import { MdClose } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import {
  IoCloudUploadOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

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
  const [numberOfSuccesses, setNumberOfSuccesses] = useState<number | null>(null);
  const [numberOfFailures, setNumberOfFailures] = useState<number | null>(null);

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
    setNumberOfSuccesses(null);
    setNumberOfFailures(null);
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
      setIsLoading(false);
    }
  };

  return (
    <form
      id="file-upload"
      onSubmit={handleSubmit}
      className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <IoCloudUploadOutline className="text-green-600" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Images</h2>
            <p className="text-sm text-gray-500">
              Add new artwork to your collection
            </p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {numberOfFailures !== null && numberOfFailures > 0 && (
            <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
              <IoCloseCircleOutline size={18} />
              {numberOfFailures > 1
                ? `${numberOfFailures} files failed to upload`
                : "1 file failed to upload"}
            </div>
          )}

          {numberOfSuccesses !== null && numberOfSuccesses > 0 && (
            <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm">
              <IoCheckmarkCircleOutline size={18} />
              {numberOfSuccesses > 1
                ? `${numberOfSuccesses} files uploaded successfully`
                : "1 file uploaded successfully"}
            </div>
          )}
        </div>
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

      {/* File List */}
      <div className="mb-6">
        {selectedFiles.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Selected Files ({selectedFiles.length})
              </h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {selectedFiles.map((item, index) => (
                <div
                  key={item.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg transition-colors
                    ${
                      item.status === "error"
                        ? "bg-red-50 border border-red-200"
                        : "bg-white border border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    {item.status === "error" && item.errorMessage && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-red-700">
                        <IoIosWarning size={14} />
                        {item.errorMessage}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={() => handleRemoveFile(index)}
                    title="Remove file"
                  >
                    <MdClose size={20} className="text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <IoCloudUploadOutline size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No files selected
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Click the button below to choose images
            </p>
            <button
              type="button"
              onClick={handleOpenFileDialog}
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Choose Files
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleOpenFileDialog}
            disabled={isLoading}
            className={`
              w-full sm:w-auto px-6 py-2 font-medium rounded-lg transition-colors
              ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }
            `}
          >
            Add More Files
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className={`
                flex-1 sm:flex-none px-6 py-2 font-medium rounded-lg transition-colors
                ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }
              `}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 font-medium rounded-lg transition-colors
                ${
                  isLoading
                    ? "bg-green-300 text-white cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <IoCloudUploadOutline size={18} />
                  Upload Files
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default FileUpload;
