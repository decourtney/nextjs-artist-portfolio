import { ITag } from "@/models/Tag";

export type AllTags = {
  substances: ITag[];
  mediums: ITag[];
  sizes: ITag[];
  categories: ITag[];
};
