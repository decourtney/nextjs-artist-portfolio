"use client";
import React, { createContext, useContext, useState } from "react";

interface FilteredArtworksContextValue {
  filteredNames: string[];
  setFilteredNames: (artworks: string[]) => void;
}

const FilteredArtworksContext = createContext<
  FilteredArtworksContextValue | undefined
>(undefined);

export const FilteredArtworksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  return (
    <FilteredArtworksContext.Provider
      value={{ filteredNames, setFilteredNames }}
    >
      {children}
    </FilteredArtworksContext.Provider>
  );
};

export const useFilteredArtworks = () => {
  const context = useContext(FilteredArtworksContext);
  if (!context) {
    throw new Error(
      "useFilteredArtworks must be used within a FilteredArtworksProvider"
    );
  }
  return context;
};
