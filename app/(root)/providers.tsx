"use client";

import { FilteredArtworkProvider } from "@/app/context/FilteredArtworkContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FilteredArtworkProvider>{children}</FilteredArtworkProvider>;
}
