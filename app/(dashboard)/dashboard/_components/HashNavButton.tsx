"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface HashNavButtonProps {
  params: string;
}

const HashNavButton = ({ params }: HashNavButtonProps) => {
  const path = usePathname();

  // Format the label: "file-management" -> "File Management"
  const label = params
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Link
      href={`${path}/#${params}`}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors whitespace-nowrap"
    >
      {label}
    </Link>
  );
};

export default HashNavButton;
