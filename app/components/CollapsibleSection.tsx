"use client";
import React, { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer pl-2 font-medium text-left text-xl text-foreground-200"
      >
        {title}
      </div>
      {open && <ul>{children}</ul>}
    </div>
  );
};

export default CollapsibleSection;
