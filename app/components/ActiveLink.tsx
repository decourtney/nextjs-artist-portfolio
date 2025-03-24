"use client";

import Link, { LinkProps } from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useHash } from "@/utils/useHash";

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function ActiveLink({ children, ...props }: ActiveLinkProps) {
  const params = useParams();
  const pathname = usePathname();
  const [isActive, setIsActive] = useState<boolean>(false);
  const hash = useHash();

  useEffect(() => {
    setIsActive(pathname + window.location.hash === props.href);
  }, [params, hash]);

  return (
    <Link {...props}>
      <div
        className={`px-1 text-lg text-foreground-500 content-center hover:shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))] pointer-events-auto ${
          isActive
            ? "shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))]"
            : ""
        }`}
        onClick={props.onClick}
      >
        {children}
      </div>
    </Link>
  );
}
