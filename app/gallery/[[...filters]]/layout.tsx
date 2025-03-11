import dbConnect from "@/lib/dbConnect";
import Tag, { TagDocument } from "@/models/Tag";
import { TagType } from "@/types/tagType";
import { Link } from "@heroui/react";
import React from "react";

/**
 * Parse segments like ["category-landscape","size-4x4"] into an object:
 * {
 *   category: ["landscape"],
 *   size: ["4x4"],
 *   medium: [],
 * }
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
  return [
    str.slice(0, idx),
    str.slice(idx + sep.length), // the remainder (including any other dashes)
  ];
}

/**
 * Build a new segments array after clicking a tag of (clickedType, clickedLabel).
 * - If singleSelect for that type => replace existing label(s).
 * - Otherwise => toggle the label in the array.
 * - Then remove duplicates & sort.
 */
function buildNewSegments(
  currentSegments: string[],
  clickedType: string,
  clickedLabel: string,
  singleSelectTypes: Record<string, boolean>
): string[] {
  const active = parseActiveFilters(currentSegments);

  if (singleSelectTypes[clickedType]) {
    // single select => toggle if it's the same label
    const existingLabels = active[clickedType] ?? [];

    // If user clicks the same label, remove it (toggle off); otherwise, select it
    if (existingLabels.length === 1 && existingLabels[0] === clickedLabel) {
      // Same label => remove
      active[clickedType] = [];
    } else {
      // Different label => select only the new one
      active[clickedType] = [clickedLabel];
    }
  } else {
    // multi select => toggle
    const existingLabels = active[clickedType] ?? [];
    if (existingLabels.includes(clickedLabel)) {
      // remove it
      active[clickedType] = existingLabels.filter(
        (lbl) => lbl !== clickedLabel
      );
    } else {
      active[clickedType] = [...existingLabels, clickedLabel];
    }
  }

  // Rebuild final segments
  let newSegments: string[] = [];
  for (const [type, labels] of Object.entries(active)) {
    for (const lbl of labels) {
      if (lbl) {
        newSegments.push(`${type}-${lbl}`);
      }
    }
  }

  // Remove duplicates & optionally sort
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

  // For demonstration: medium & size are single-select; category is multiple
  const singleSelectTypes: Record<string, boolean> = {
    category: false,
    medium: true,
    size: true,
  };

  // Current segments from the URL, e.g. ["category-landscape","size-4x4"]
  const currentSegments = params.filters || [];
  // Parse them into { category: ["landscape"], size: ["4x4"], etc. }
  const activeFilters = parseActiveFilters(currentSegments);

  // Group tags by type (TagType)
  const groupedTags = Object.values(TagType).reduce((acc, typeValue) => {
    acc[typeValue] = tags.filter((tag) => tag.type === typeValue);
    return acc;
  }, {} as Record<TagType, TagDocument[]>);

  return (
    <div className="flex">
      <div className="w-[260px] min-h-[calc(100dvh-64px)] bg-content4-900">
        <div className="sticky top-0 left-0 space-y-10 p-2">
          {Object.entries(groupedTags).map(([type, tagArray]) => (
            <section key={type} className="pt-2">
              <h2 className="w-full font-medium text-center text-4xl text-foreground-300">
                {toTitleCase(type)}
              </h2>
              <ul className="space-y-2">
                {tagArray.map((tag) => {
                  const clickedType = type;
                  const clickedLabel = tag.label;

                  // Build the new route if the user clicks this tag
                  const newSegments = buildNewSegments(
                    currentSegments,
                    clickedType,
                    clickedLabel,
                    singleSelectTypes
                  );
                  const href = newSegments.length
                    ? `/gallery/${newSegments.join("/")}`
                    : "/gallery"; // if removing all => base route

                  // Check if this tag is currently active
                  const isActive =
                    activeFilters[clickedType]?.includes(clickedLabel);

                  // Decide on link color for the active toggle
                  const textClass = isActive
                    ? "text-blue-400 font-semibold"
                    : "text-foreground-900";

                  return (
                    <li key={tag._id}>
                      <Link href={href} className="w-full">
                        <p
                          className={`w-full text-center text-xl transition-colors ${textClass}`}
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
      </div>

      {children}
    </div>
  );
};

export default GalleryLayout;

/*
  Explanation:
  1) parseActiveFilters(currentSegments) => object like { category: ["landscape"], size: ["4x4"] }
  2) buildNewSegments(...) => merges or toggles the clicked filter. 
       - If singleSelect (e.g. size, medium), it replaces the existing label for that type
       - If multiSelect (e.g. category), toggles the label in that array
  3) newSegments => array like ["category-landscape","size-4x4"] => joined as /gallery/category-landscape/size-4x4
  4) isActive => checks if the tag is already in activeFilters => we highlight it differently.
  5) No duplicates => we convert newSegments to a Set and back, then .sort().

  This ensures a user can't add duplicates, 
  and an already-active tag will appear differently (blue text).
*/
