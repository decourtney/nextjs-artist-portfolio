import Illustration from "@/models/Illustration";
import Artwork from "@/models/Artwork";
import { Types } from "mongoose";

export interface ArtworkPlain {
  id: Types.ObjectId | string;
  name: string;
  thumbSrc: string;
}

export interface IllustrationPlain {
  id: Types.ObjectId | string;
  name: string;
  artworkIds: string[];
}

// Helper to safely convert ObjectId to string
const oid = (v: any) => v?.toString?.() ?? v;

export async function getIllustrationsForClient() {
  const illustrationsRaw = await Illustration.find().lean();
  const artworkIds = [...new Set(illustrationsRaw.flatMap((i) => i.artwork))];

  const artworksRaw = await Artwork.find(
    { _id: { $in: artworkIds } },
    { name: 1, thumbSrc: 1 }
  ).lean();

  // serialize db objects for passing to client components - populate vs manual serialization
  // serialize artworks into a map keyed by _id string
  const artworksById: ArtworkPlain[] = Object.fromEntries(
    artworksRaw.map((a) => [
      oid(a._id),
      {
        id: oid(a._id),
        name: a.name,
        thumbSrc: a.thumbSrc,
      },
    ])
  );

  // serialize illustrations and map ObjectIds to strings
  const illustrations: IllustrationPlain[] = illustrationsRaw.map((i) => ({
    id: oid(i._id),
    name: i.name,
    artworkIds: i.artwork?.map(oid) ?? [],
  }));

  // now we can return normalized flat objects with illustrations still maintaining references to artworks
  return {
    illustrations,
    artworksById,
  };
}
