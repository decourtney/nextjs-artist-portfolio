"use client";

import { TagDocument } from "@/models/Tag";
import { TagType } from "@/types/tagType";
import { ParseActiveFilters } from "@/utils/filters";
import { Link } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { toTitleCase } from "@/utils/titleCase";

interface SidebarContentProps {
  currentSegments: string[];
  activeFilters: Record<string, string[]>;
  groupedTags: Record<TagType, TagDocument[]>;
  singleSelectTypes: Record<string, boolean>;
}

function buildNewSegments(
  currentSegments: string[],
  clickedType: string,
  clickedLabel: string,
  singleSelectTypes: Record<string, boolean>
): string[] {
  const active = ParseActiveFilters(currentSegments);
  if (singleSelectTypes[clickedType]) {
    const existingLabels = active[clickedType] ?? [];
    if (existingLabels.length === 1 && existingLabels[0] === clickedLabel) {
      active[clickedType] = [];
    } else {
      active[clickedType] = [clickedLabel];
    }
  } else {
    const existingLabels = active[clickedType] ?? [];
    if (existingLabels.includes(clickedLabel)) {
      active[clickedType] = existingLabels.filter(
        (lbl) => lbl !== clickedLabel
      );
    } else {
      active[clickedType] = [...existingLabels, clickedLabel];
    }
  }
  let newSegments: string[] = [];
  for (const [type, labels] of Object.entries(active)) {
    for (const lbl of labels) {
      if (lbl) {
        newSegments.push(`${type}-${lbl}`);
      }
    }
  }
  newSegments = Array.from(new Set(newSegments));
  newSegments.sort();
  return newSegments;
}

function buildInitialSidebarState(
  groupedTags: Record<TagType, TagDocument[]>
): Record<string, boolean> {
  // Attempt to read from localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sidebarDetailsOpen");
    if (saved) {
      try {
        // If it’s valid JSON, return it
        return JSON.parse(saved);
      } catch (err) {
        console.error("Could not parse localStorage sidebarDetailsOpen", err);
      }
    }
  }

  // If nothing in localStorage or parse failed, build a default fallback
  const defaultState: Record<string, boolean> = {};
  for (const type of Object.keys(groupedTags)) {
    defaultState[type] = false; // False = details area collapsed by default
  }
  return defaultState;
}

const SidebarContent = ({
  currentSegments,
  activeFilters,
  groupedTags,
  singleSelectTypes,
}: SidebarContentProps) => {
  const [detailsOpen, setDetailsOpen] = useState<Record<string, boolean>>(() =>
    buildInitialSidebarState(groupedTags)
  );

  const handleToggle = (
    type: string,
    e: React.SyntheticEvent<HTMLDetailsElement>
  ) => {
    const isOpen = e.currentTarget.open;
    setDetailsOpen((prev) => {
      const newState = { ...prev, [type]: isOpen };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "sidebarDetailsOpen",
          JSON.stringify(newState)
        );
      }
      return newState;
    });
  };

  return (
    <div className="sticky top-0 left-0 h-screen space-y-2 p-2 pb-14 overflow-scroll scrollbar-hide">
      {Object.entries(groupedTags).map(([type, tagArray]) => {
        // If we never set a value for this type, default to true or false.
        const open = detailsOpen[type] ?? false;

        return (
          <details
            key={type}
            className="w-full"
            open={open}
            onToggle={(e) => handleToggle(type, e)}
          >
            <summary className="cursor-pointer w-full md:pl-2 font-medium text-left text-xl text-foreground-200">
              {toTitleCase(type)}
            </summary>
            <ul>
              {tagArray.map((tag) => {
                const clickedType = type;
                const clickedLabel = tag.label;
                const newSegments = buildNewSegments(
                  currentSegments,
                  clickedType,
                  clickedLabel,
                  singleSelectTypes
                );
                const href = newSegments.length
                  ? `/gallery/${newSegments.join("/")}`
                  : "/gallery";
                const isActive =
                  activeFilters[clickedType]?.includes(clickedLabel);
                const textClass = isActive
                  ? "text-foreground-800 font-semibold"
                  : "text-foreground-400";

                return (
                  <li key={tag._id}>
                    <Link
                      href={href}
                      className="w-full hover:bg-gradient-to-t from-content4-700 to-transparent"
                    >
                      <p
                        className={`w-full pl-2 md:pl-6 text-xl transition-colors ${textClass}`}
                      >
                        {toTitleCase(tag.label)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </div>
  );
};

export default React.memo(SidebarContent);
