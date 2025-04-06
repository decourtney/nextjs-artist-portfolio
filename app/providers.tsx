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
  session: any;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider session={session}>
        <Suspense fallback={<div>Loading content...</div>}>
          <FilteredArtworkProvider>{children}</FilteredArtworkProvider>
        </Suspense>
      </SessionProvider>
    </Suspense>
  );
}
