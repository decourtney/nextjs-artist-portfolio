// app/gallery/layout.tsx
import dbConnect from "@/lib/dbConnect";
import Tag, { TagDocument } from "@/models/Tag";
import { TagType } from "@/types/tagType";
import { Link } from "@heroui/react";
import React from "react";
import MobileSidebar from "./MobileSidebar";

/**
 * Parse segments like ["category-landscape","size-4x4"] into an object:
 * { category: ["landscape"], size: ["4x4"], medium: [] }
 */
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

function splitFirst(str: string, sep: string) {
  const idx = str.indexOf(sep);
  if (idx === -1) return [str]; // no separator
  return [str.slice(0, idx), str.slice(idx + sep.length)];
}

/**
 * Build a new segments array after clicking a tag.
 */
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

function toTitleCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const GalleryLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { filters?: string[] };
}) => {
  await dbConnect();

  const tagData = await Tag.find();
  const tags = JSON.parse(JSON.stringify(tagData)) as TagDocument[];

  // For demonstration: medium & size are single-select; category is multi-select.
  const singleSelectTypes: Record<string, boolean> = {
    category: false,
    medium: true,
    size: true,
  };

  const currentSegments = params.filters || [];
  const activeFilters = parseActiveFilters(currentSegments);

  const groupedTags = Object.values(TagType).reduce((acc, typeValue) => {
    acc[typeValue] = tags.filter((tag) => tag.type === typeValue);
    return acc;
  }, {} as Record<TagType, TagDocument[]>);

  // Filter content shared between mobile and desktop.
  const sidebarContent = (
    <div className="sticky top-0 left-0">
      {Object.entries(groupedTags).map(([type, tagArray]) => (
        <section key={type} className="pt-2">
          <h2 className="w-full md:pl-2 font-medium text-left text-xl text-foreground-200">
            {toTitleCase(type)}
          </h2>
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
        </section>
      ))}
    </div>
  );

  return (
    <div className="flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-[200px] min-h-[calc(100dvh-64px)] bg-content4-900">
        {sidebarContent}
      </div>
      {/* Mobile sidebar */}
      <MobileSidebar>{sidebarContent}</MobileSidebar>
      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default GalleryLayout;
