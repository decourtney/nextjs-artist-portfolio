"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { PreviousPathnameProvider } from "./context/PreviousPathnameContext";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();

  return (
    <SessionProvider session={session}>
      <PreviousPathnameProvider>
        <div key={pathname}>{children}</div>
      </PreviousPathnameProvider>
    </SessionProvider>
  );
}
