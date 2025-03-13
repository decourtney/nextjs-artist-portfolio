import React from "react";
import { Link } from "@heroui/react";
import { TagType } from "@/types/tagType";
import { TagDocument } from "@/models/Tag";

function toTitleCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function splitFirst(str: string, sep: string) {
  const idx = str.indexOf(sep);
  if (idx === -1) return [str];
  return [str.slice(0, idx), str.slice(idx + sep.length)];
}

function parseActiveFilters(segments: string[]): Record<string, string[]> {
  const active: Record<string, string[]> = {};
  for (const seg of segments) {
    const [type, label] = splitFirst(seg, "-");
    if (!active[type]) {
      active[type] = [];
    }
    active[type].push(label);
  }
  return active;
}

function buildNewSegments(
  currentSegments: string[],
  clickedType: string,
  clickedLabel: string,
  singleSelectTypes: Record<string, boolean>
): string[] {
  const active = parseActiveFilters(currentSegments);
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

interface SidebarContentProps {
  currentSegments: string[];
  activeFilters: Record<string, string[]>;
  groupedTags: Record<TagType, TagDocument[]>;
  singleSelectTypes: Record<string, boolean>;
}

import CollapsibleSection from "./CollapsibleSection"; // the component we just created

const SidebarContent: React.FC<SidebarContentProps> = ({
  currentSegments,
  activeFilters,
  groupedTags,
  singleSelectTypes,
}) => {
  return (
    <div className="sticky top-0 left-0 h-screen space-y-2 p-2 pb-14 overflow-scroll scrollbar-hide">
      {Object.entries(groupedTags).map(([type, tagArray]) => (
        <CollapsibleSection key={type} title={toTitleCase(type)}>
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
            const isActive = activeFilters[clickedType]?.includes(clickedLabel);
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
        </CollapsibleSection>
      ))}
    </div>
  );
};

export default React.memo(SidebarContent);
