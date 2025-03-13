// app/gallery/layout.tsx
import dbConnect from "@/lib/dbConnect";
import Tag, { TagDocument } from "@/models/Tag";
import { TagType } from "@/types/tagType";
import React from "react";
import MobileSidebar from "@/app/components/MobileSidebar";
import SidebarContent from "@/app/components/SidebarContent";

function parseActiveFilters(segments: string[]): Record<string, string[]> {
  // (same implementation as in SidebarContent, or import from a shared file)
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
  if (idx === -1) return [str];
  return [str.slice(0, idx), str.slice(idx + sep.length)];
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

  return (
    <div className="flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-[200px] min-h-[calc(100dvh-64px)] bg-content4-900">
        <SidebarContent
          currentSegments={currentSegments}
          activeFilters={activeFilters}
          groupedTags={groupedTags}
          singleSelectTypes={singleSelectTypes}
        />
      </div>
      {/* Mobile sidebar */}
      <MobileSidebar>
        <SidebarContent
          currentSegments={currentSegments}
          activeFilters={activeFilters}
          groupedTags={groupedTags}
          singleSelectTypes={singleSelectTypes}
        />
      </MobileSidebar>
      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default GalleryLayout;
