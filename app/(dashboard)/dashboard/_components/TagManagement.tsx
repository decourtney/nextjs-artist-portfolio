"use client";

import { ITag } from "@/models/Tag";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoPricetagOutline,
  IoAddCircleOutline,
  IoCloseCircle,
} from "react-icons/io5";

interface TagManagementProps {
  tags: {
    substances: ITag[];
    mediums: ITag[];
    sizes: ITag[];
    categories: ITag[];
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
    setIsLoading(true);

    try {
      const res = await fetch("/api/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add tag");
        setIsLoading(false);
        return;
      }

      formRef.current?.reset();
      setSuccess("Tag added successfully");
      setNewTag({ label: "", type: "category", description: "" });
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      setError("An error occurred while adding the tag");
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async (id: string, label: string) => {
    if (!confirm(`Delete tag "${label}"? This cannot be undone.`)) {
      return;
    }

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

      setSuccess(`Tag "${label}" deleted successfully`);
      router.refresh();
    } catch (error) {
      setError("An error occurred while deleting the tag");
    }
  };

  const getTagColor = (type: string) => {
    switch (type) {
      case "category":
        return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200";
      case "substance":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200";
      case "size":
        return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
    }
  };

  const renderTagList = (tagList: ITag[], type: string) => {
    if (tagList.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic">
          No {type} tags yet. Add one above.
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {tagList.map((tag) => (
          <div
            key={tag._id}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
              ${getTagColor(tag.type)}
            `}
          >
            <span className="font-medium">{tag.label}</span>
            <button
              onClick={() => handleDeleteTag(tag._id, tag.label)}
              className="hover:scale-110 transition-transform"
              title={`Delete ${tag.label}`}
            >
              <IoCloseCircle size={18} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      id="tag-management"
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
            <IoPricetagOutline className="text-indigo-600" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tag Management</h2>
            <p className="text-sm text-gray-500">
              Create and organize your artwork tags
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <IoCloseCircle size={20} />
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <IoAddCircleOutline size={20} />
              {success}
            </div>
          )}
        </div>
      )}

      {/* Add New Tag Form */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Tag
        </h3>

        <form ref={formRef} onSubmit={handleAddTag} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="tag-label"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tag Name
              </label>
              <input
                id="tag-label"
                type="text"
                value={newTag.label}
                onChange={(e) =>
                  setNewTag({ ...newTag, label: e.target.value })
                }
                placeholder="Enter tag name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="tag-type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tag Type
              </label>
              <select
                id="tag-type"
                value={newTag.type}
                onChange={(e) => setNewTag({ ...newTag, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="category">Category</option>
                <option value="medium">Medium</option>
                <option value="size">Size</option>
                <option value="substance">Substance</option>
              </select>
            </div>
          </div>

          {newTag.type === "category" && (
            <div>
              <label
                htmlFor="category-description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Description (Optional)
              </label>
              <textarea
                id="category-description"
                value={newTag.description}
                onChange={(e) =>
                  setNewTag({ ...newTag, description: e.target.value })
                }
                placeholder="Add a description for this category..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !newTag.label.trim()}
              className={`
                flex items-center gap-2 px-6 py-2 font-medium rounded-lg transition-colors
                ${
                  isLoading || !newTag.label.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <IoAddCircleOutline size={20} />
                  Add Tag
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tag Lists */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
            <span className="text-sm text-gray-500">
              ({tags.categories.length})
            </span>
          </div>
          {renderTagList(tags.categories, "category")}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Sizes</h3>
            <span className="text-sm text-gray-500">({tags.sizes.length})</span>
          </div>
          {renderTagList(tags.sizes, "size")}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Substances</h3>
            <span className="text-sm text-gray-500">
              ({tags.substances.length})
            </span>
          </div>
          {renderTagList(tags.substances, "substance")}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Mediums</h3>
            <span className="text-sm text-gray-500">
              ({tags.mediums.length})
            </span>
          </div>
          {renderTagList(tags.mediums, "medium")}
        </div>
      </div>
    </section>
  );
}
