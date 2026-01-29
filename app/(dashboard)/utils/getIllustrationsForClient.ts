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
export const oid = (v: string | { toString(): string }): string => v.toString();

// Retrieve illustration and associated Artwork documents
// Construct and return record objs of the documents
export async function getIllustrationsForClient() {
  const illustrations = await Illustration.find().lean();
  const artworks = await Artwork.find({ isIllustration: true }).lean();

  // create set of artwork ids that are assigned to an illustration
  const assignedIds = new Set(
    illustrations.flatMap((i) => i.artworkIds.map((id: string) => oid(id))),
  );

  // create an array of remaining artwork ids not in the set
  const unassignedArtworks = artworks
    .filter((a) => !assignedIds.has(oid(a._id as string)))
    .map((a) => oid(a._id as string));

  // create a virtual record for unassigned artwork ids
  const unassignedRecord: IllustrationObj = {
    id: "unassigned",
    name: "Unassigned",
    artworkIds: unassignedArtworks,
    isPersisted: false,
    isDirty: false,
  };

  // create records for illustrations and assigned artwork
  const artworkRecords: Record<string, ArtworkObj> = Object.fromEntries(
    artworks.map((a) => [
      oid(a._id as string),
      {
        id: oid(a._id as string),
        name: a.name,
        thumbSrc: a.thumbSrc,
      },
    ]),
  );

  const illustrationRecords: Record<string, IllustrationObj> =
    Object.fromEntries(
      illustrations.map((i) => [
        oid(i._id as string),
        {
          id: oid(i._id as string),
          name: i.name,
          artworkIds: i.artworkIds?.map(oid) ?? [],
          isPersisted: true,
          isDirty: false,
        },
      ]),
    );

  if (illustrationRecords[unassignedRecord.id]) {
    throw new Error("Unassigned record id collision");
  }

  // add the virtual record
  const illustrationAndUnassignedRecords = {
    ...illustrationRecords,
    [unassignedRecord.id]: unassignedRecord,
  };

  return {
    illustrationAndUnassignedRecords,
    artworkRecords,
  };
}
