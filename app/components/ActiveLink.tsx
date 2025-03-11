"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface ActiveLinkProps extends LinkProps {
  children: (props: { isActive: boolean }) => React.ReactNode;
}

export default function ActiveLink({ children, ...props }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return <Link {...props}>{children({ isActive })}</Link>;
}
