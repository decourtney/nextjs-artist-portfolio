'use server'

import dbConnect from "@/lib/dbConnect";
import Tag, { TagDocument } from "@/models/Tag";
import { TagType } from "@/types/tagType";
import React from "react";
import MobileSidebar from "@/app/components/MobileSidebar";
import SidebarContent from "@/app/components/SidebarContent";
import { ParseActiveFilters } from "@/utils/filters";

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
  const activeFilters = ParseActiveFilters(currentSegments);

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
      <div className="block md:hidden z-50">
        <MobileSidebar>
          <SidebarContent
            currentSegments={currentSegments}
            activeFilters={activeFilters}
            groupedTags={groupedTags}
            singleSelectTypes={singleSelectTypes}
          />
        </MobileSidebar>
      </div>
      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default GalleryLayout;
