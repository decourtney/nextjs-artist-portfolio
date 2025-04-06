"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React, { ReactNode, Suspense } from "react";
import { FilteredArtworkProvider } from "./context/FilteredArtworkContext";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider session={session}>
        <FilteredArtworkProvider>{children}</FilteredArtworkProvider>
      </SessionProvider>
    </Suspense>
  );
}
