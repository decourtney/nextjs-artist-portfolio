// Define the categories as a TypeScript const array
export const categoryValues = [
  "painting",
  "sculpture",
  "photography",
  "digital",
  "mixed",
] as const;

export type CategoryType = (typeof categoryValues)[number];
