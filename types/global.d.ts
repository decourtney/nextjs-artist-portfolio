export {};

declare global {
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

import { PopulatedArtworkDocument } from "@/models/Artwork";

export type SpecialPage = {
  type: string;
  src: string;
  metaWidth: number;
  metaHeight: number;
};

export type BookPage = PopulatedArtworkDocument | SpecialPage;
