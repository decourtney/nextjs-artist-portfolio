"use client";

import { TagDocument } from "@/models/Tag";
import { TagType } from "@/types/tagType";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface SidebarContentProps {
  currentSegments: string[];
  activeFilters: Record<string, string[]>;
  groupedTags: Record<TagType, TagDocument[]>;
  singleSelectTypes: Record<string, boolean>;
}

const SidebarContent = ({
  currentSegments,
  activeFilters,
  groupedTags,
  singleSelectTypes,
}: SidebarContentProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildFilterPath = (type: string, label: string) => {
    const newFilters = [...currentSegments];
    const filterIndex = newFilters.findIndex((segment) => segment === type);

    if (filterIndex !== -1) {
      // If the filter type exists, check if the label is already selected
      const labelIndex = newFilters.findIndex((segment) => segment === label);
      if (labelIndex !== -1) {
        // Remove the label if it's already selected
        newFilters.splice(labelIndex, 1);
      } else if (singleSelectTypes[type]) {
        // For single-select types, replace the existing value
        newFilters[filterIndex + 1] = label;
      } else {
        // For multi-select types, add the new label
        newFilters.splice(filterIndex + 1, 0, label);
      }
    } else {
      // Add the new filter type and label
      newFilters.push(type, label);
    }

    return `/gallery/${newFilters.join("/")}`;
  };

  const isFilterActive = (type: string, label: string) => {
    return activeFilters[type]?.includes(label) || false;
  };

  return (
    <div className="p-4 space-y-6">
      {Object.entries(groupedTags).map(([type, tags]) => (
        <div key={type} className="space-y-2">
          <summary className="text-foreground-500 font-medium cursor-pointer">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </summary>
          <div className="space-y-1">
            {tags.map((tag) => {
              const isActive = isFilterActive(type, tag.label);
              const textClass = isActive
                ? "text-primary-500"
                : "text-foreground-400 hover:text-primary-500";

              return (
                <Link
                  key={tag._id}
                  href={buildFilterPath(type, tag.label)}
                  className={`block p-2 rounded-medium hover:bg-background-300 transition-colors ${textClass}`}
                >
                  {tag.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarContent;
