export type EditFormData = {
  id: string;
  name: string;
  description?: string;
  substance?: string;
  medium?: string;
  size?: string;
  category?: string;
  price: number;
  isAvailable: boolean;
  isMainImage: boolean;
  isFeatured: boolean;
  isCategoryImage: boolean;
};
