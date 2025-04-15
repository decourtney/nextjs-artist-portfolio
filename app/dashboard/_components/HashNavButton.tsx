"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface HashNavButtonProps {
  params: string;
}

const HashNavButton = ({params}:HashNavButtonProps) => {
  const path = usePathname();
  
  return (
    <Link
      href={`${path}/#${params}`}
      className="h-fit px-2 py-2  text-tiny text-white bg-foreground-500 hover:bg-foreground-600 rounded-md"
    >
      {params.replace("-", " ").toUpperCase()}
    </Link>
  );
};

export default HashNavButton;
