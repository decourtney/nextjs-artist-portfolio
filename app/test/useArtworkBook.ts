import { useState, useEffect } from 'react';

interface Artwork {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export function useArtworkBook() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await fetch('/api/artwork');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        setArtworks(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artworks');
        setIsLoading(false);
      }
    }
    fetchArtworks();
  }, []);

  const nextPage = () => {
    if (currentPage < artworks.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    currentArtwork: artworks[currentPage],
    nextPage,
    prevPage,
    canGoNext: currentPage < artworks.length - 1,
    canGoPrev: currentPage > 0,
    isLoading,
    error,
    totalPages: artworks.length
  };
}
