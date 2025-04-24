"use client";

import { TagDocument } from "@/models/Tag";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import LoadingSpinner from "./LoadingSpinner";
import { overlay } from "@/ColorTheme";

interface TagManagementProps {
  tags: {
    substances: TagDocument[];
    mediums: TagDocument[];
    sizes: TagDocument[];
    categories: TagDocument[];
  };
}

export default function TagManagement({ tags }: TagManagementProps) {
  const router = useRouter();
  const [newTag, setNewTag] = useState({
    label: "",
    type: "category",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading

    try {
      const res = await fetch("/api/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add tag");
        return;
      }

      formRef.current?.reset()
      setSuccess("Tag added successfully");
      setNewTag({ label: "", type: "category", description: "" });
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      setError("An error occurred while adding the tag");
    }
  };

  const handleDeleteTag = async (id: string) => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/tag", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to delete tag");
        return;
      }

      setSuccess("Tag deleted successfully");
      router.refresh();
    } catch (error) {
      setError("An error occurred while deleting the tag");
    }
  };

  const renderTagList = (tagList: TagDocument[]) => (
    <div key={tagList[0].type} className="space-y-2">
      <h3 className="text-lg font-semibold capitalize">{tagList[0].type}</h3>
      <div className="flex flex-wrap gap-2">
        {tagList.map((tag) => (
          <div
            key={tag._id}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
          >
            <span>{tag.label}</span>
            <button
              onClick={() => handleDeleteTag(tag._id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="tag-management"
      className="space-y-6 bg-background-50 p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center">
        <h2 className="mr-6 text-2xl font-bold text-foreground-500">
          Tag Management
        </h2>

        <div className="flex-1 h-full">
          {error && (
            <div className="p-1 text-center bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-1 text-center bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
        </div>
      </div>

      {/* Add new tag form */}
      <form ref={formRef} onSubmit={handleAddTag} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <input
              id="tag-label"
              type="text"
              value={newTag.label}
              onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 border rounded-md"
            />

            <textarea
              disabled={newTag.type !== "category"}
              id="category-description"
              onChange={(e) =>
                setNewTag({ ...newTag, description: e.target.value })
              }
              placeholder={
                newTag.type === "category" ? "Category Description" : ""
              }
              rows={3}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <select
              id="tag-type"
              value={newTag.type}
              onChange={(e) => setNewTag({ ...newTag, type: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="category">Category</option>
              <option value="medium">Medium</option>
              <option value="size">Size</option>
              <option value="substance">Substance</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="relative h-fit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            style={{backgroundColor: isLoading ? overlay[100] : undefined}}
          >
            Add Tag
            {isLoading && <LoadingSpinner />}
          </button>
        </div>
      </form>

      {/* Tag lists */}
      <div className="space-y-6">
        {Object.values(tags).map((tagList) => renderTagList(tagList))}
      </div>
    </section>
  );
}
