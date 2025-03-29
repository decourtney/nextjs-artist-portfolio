"use client";

import Link, { LinkProps } from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const useHash = () => {
  // Lazy initializer: check if window exists.
  const [hash, setHash] = useState(() => {
    return typeof window !== "undefined" ? window.location.hash : "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onHashChanged = () => setHash(window.location.hash);
    const { pushState, replaceState } = window.history;

    window.history.pushState = function (...args) {
      pushState.apply(window.history, args);
      setTimeout(() => setHash(window.location.hash));
    };

    window.history.replaceState = function (...args) {
      replaceState.apply(window.history, args);
      setTimeout(() => setHash(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChanged);
    return () => {
      window.removeEventListener("hashchange", onHashChanged);
    };
  }, []);

  return hash;
};

export default function ActiveLink({ children, ...props }: ActiveLinkProps) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState<boolean>(false);
  const hash = useHash();

  useEffect(() => {
    setIsActive(pathname + hash === props.href);
  }, [pathname, hash, props.href]);

  return (
    <Link {...props}>
      <div
        className={`px-2 text-lg text-foreground-500 content-center hover:shadow-[inset_0_-4px_0_hsl(var(--heroui-primary-500))] pointer-events-auto ${
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
