import Illustration from "@/models/Illustration";
import Artwork from "@/models/Artwork";

export interface ArtworkObj {
  id: string;
  name: string;
  thumbSrc: string;
}

export interface IllustrationObj {
  id: string;
  name: string;
  artworkIds: string[];
  isPersisted: boolean;
  isDirty: boolean;
}

// Helper to safely convert value to string
const oid = (v: any) => v?.toString?.() ?? v;

// Retrieve illustration and associated Artwork documents
// Construct and return record objs of the documents
export async function getIllustrationsForClient() {
  const illustrationsRaw = await Illustration.find().lean();
  const artworkIds = [...new Set(illustrationsRaw.flatMap((i) => i.artworkIds))];
  const artworksRaw = await Artwork.find(
    { _id: { $in: artworkIds } },
    { name: 1, thumbSrc: 1 }
  ).lean();

  const artworkRecords: Record<string, ArtworkObj> = Object.fromEntries(
    artworksRaw.map((a) => [
      oid(a._id),
      {
        id: oid(a._id),
        name: a.name,
        thumbSrc: a.thumbSrc,
      },
    ])
  );

  const illustrationRecords: Record<string, IllustrationObj> =
    Object.fromEntries(
      illustrationsRaw.map((i) => [
        oid(i._id),
        {
          id: oid(i._id),
          name: i.name,
          artworkIds: i.artworkIds?.map(oid) ?? [],
          isPersisted: true,
          isDirty: false,
        },
      ])
    );

  return {
    illustrationRecords,
    artworkRecords,
  };
}
