import { ITag } from "@/models/Tag";

export function BuildQueryFromFilters(
  activeFilters: Record<string, string[]>,
  tags: ITag[]
): Record<string, any> {
  const query: Record<string, any> = {};

  // --- Categories Filter (multi-select) ---
  if (activeFilters.category?.length) {
    const categoryTagIds = activeFilters.category
      .map((label) => {
        const matchingTag = tags.find((tag) => tag.label === label);
        return matchingTag?._id;
      })
      .filter((id) => id != null);

    if (categoryTagIds.length) {
      query.categories = { $in: categoryTagIds };
    }
  }

  // --- Medium Filter (assumed single-select) ---
  if (activeFilters.medium?.length) {
    const mediumTagIds = activeFilters.medium
      .map((label) => {
        const matchingTag = tags.find((tag) => tag.label === label);
        return matchingTag?._id;
      })
      .filter((id) => id != null);

    if (mediumTagIds.length) {
      // For single-select, only the first tag id is used.
      query.medium = mediumTagIds[0];
    }
  }

  // --- Size Filter (assumed single-select) ---
  if (activeFilters.size?.length) {
    const sizeTagIds = activeFilters.size
      .map((label) => {
        const matchingTag = tags.find((tag) => tag.label === label);
        return matchingTag?._id;
      })
      .filter((id) => id != null);

    if (sizeTagIds.length) {
      query.size = sizeTagIds[0];
    }
  }

  return query;
}
