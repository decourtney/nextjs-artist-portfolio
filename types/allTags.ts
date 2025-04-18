import { TagDocument } from "@/models/Tag";

export type AllTags = {
  substances: TagDocument[];
  mediums: TagDocument[];
  sizes: TagDocument[];
  categories: TagDocument[];
};