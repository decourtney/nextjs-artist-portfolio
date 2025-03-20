"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { FilteredArtworksProvider } from "./context/FilteredArtworkContext";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React, { ReactNode } from "react";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <HeroUIProvider navigate={router.push}>
          <FilteredArtworksProvider>{children}</FilteredArtworksProvider>
        </HeroUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
