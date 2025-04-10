"use client";

import React, { useState, ChangeEvent, useRef, FormEvent } from "react";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one file first.");
      return;
    }

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

      if (data.successes) {
        setSelectedFiles((prev) =>
          prev.filter(
            (fileItem) => !data.successes!.some((s) => s.id === fileItem.id)
          )
        );
      }

      if (data.failures) {
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

      router.refresh();
      alert("Upload completed. See highlights for success/fail status.");
    } catch (error) {
      console.error(error);
      alert("Error uploading files");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-1 shadow-md rounded-md bg-white text-gray-900"
    >
      <input
        id="file-input"
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="min-h-[200px] max-h-[500px] overflow-y-scroll rounded-lg">
        {selectedFiles.length > 0 ? (
          <>
            <h3 className="px-4 py-1 text-center bg-slate-200">
              <span>{selectedFiles.length} </span>Selected File
              {selectedFiles.length > 1 ? <span>s</span> : null}
            </h3>
            <ul className="[&>*:nth-child(even)]:bg-slate-200 text-gray-900">
              {selectedFiles.map((item, index) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center pr-1 pl-2 py-1"
                >
                  <p className="truncate">{item.name}</p>

                  <div className="flex items-center space-x-2">
                    {item.status === "error" && item.errorMessage ? (
                      <span className="p-1 rounded-sm text-red-500 bg-red-100 whitespace-nowrap">
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
          <div className="h-[200px] content-center flex items-center justify-center">
            <span>No files selected</span>
          </div>
        )}
      </div>

      <div className="flex justify-between p-2">
        <button
          type="button"
          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          onClick={handleOpenFileDialog}
        >
          Choose Files
        </button>

        <div className="space-x-4">
          <button
            type="button"
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            Upload
          </button>
        </div>
      </div>
    </form>
  );
};

export default FileUpload;
