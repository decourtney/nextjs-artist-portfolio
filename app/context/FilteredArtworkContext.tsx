"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IArtwork } from "@/models/Artwork";

interface FilteredArtworkContextType {
  filteredArtworks: IArtwork[];
  setFilteredArtworks: (artworks: IArtwork[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const FilteredArtworkContext = createContext<FilteredArtworkContextType>({
  filteredArtworks: [],
  setFilteredArtworks: () => {},
  selectedCategory: null,
  setSelectedCategory: () => {},
  isLoading: false,
  error: null,
});

export function FilteredArtworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filteredArtworks, setFilteredArtworks] = useState<IArtwork[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = useCallback(async () => {
    if (typeof window === "undefined") return; // Skip on server

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/artwork${
          selectedCategory ? `?category=${selectedCategory}` : ""
        }`,
        {
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setFilteredArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return (
    <FilteredArtworkContext.Provider
      value={{
        filteredArtworks,
        setFilteredArtworks,
        selectedCategory,
        setSelectedCategory,
        isLoading,
        error,
      }}
    >
      {children}
    </FilteredArtworkContext.Provider>
  );
}

export const useFilteredArtworks = () => useContext(FilteredArtworkContext);
