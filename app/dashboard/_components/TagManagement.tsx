"use client";

import { TagDocument } from "@/models/Tag";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TagManagementProps {
  tags: {
    categories: TagDocument[];
    mediums: TagDocument[];
    sizes: TagDocument[];
  };
}

export default function TagManagement({ tags }: TagManagementProps) {
  const router = useRouter();
  const [newTag, setNewTag] = useState({ label: "", type: "category" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

      setSuccess("Tag added successfully");
      setNewTag({ ...newTag, label: "" });
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

  const renderTagList = (tagList: TagDocument[], type: string) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold capitalize">{type}</h3>
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
    <div className="space-y-6 bg-background-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-foreground-500">Tag Management</h2>

      {/* Add new tag form */}
      <form onSubmit={handleAddTag} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newTag.label}
              onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <select
              value={newTag.type}
              onChange={(e) => setNewTag({ ...newTag, type: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="category">Category</option>
              <option value="medium">Medium</option>
              <option value="size">Size</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Tag
          </button>
        </div>
      </form>

      {/* Error and success messages */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Tag lists */}
      <div className="space-y-6">
        {renderTagList(tags.categories, "categories")}
        {renderTagList(tags.mediums, "mediums")}
        {renderTagList(tags.sizes, "sizes")}
      </div>
    </div>
  );
}
