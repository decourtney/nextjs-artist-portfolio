"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { FilteredArtworksProvider } from "./context/FilteredArtworkContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroUIProvider navigate={router.push}>
        <FilteredArtworksProvider>{children}</FilteredArtworksProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
