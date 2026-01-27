import { Artwork } from "@/models";
import Illustration from "@/models/Illustration";
import { oid } from "@/utils/objectIdToString";

interface IllustrationLean {
  _id: string;
  name: string;
  artworkIds: string[];
}

export interface IllustrationArtworkObj {
  id: string;
  name: string;
  src: string;
  thumbSrc: string;
  description: string;
}

export async function getIllustrationWithOrderedArtworks(slug: string) {
  const illustration = await Illustration.findOne<IllustrationLean>(
    { slug },
    { name: 1, artworkIds: 1 },
  ).lean();

  if (!illustration) return null;

  const artworks = await Artwork.find(
    {
      _id: { $in: illustration.artworkIds },
    },
    { name: 1, src: 1, thumbSrc: 1, description: 1 },
  ).lean();

  const artworkMap = new Map(
    artworks.map((a) => [
      oid(a._id),
      {
        id: oid(a._id),
        name: a.name,
        src: a.src,
        thumbSrc: a.thumbSrc,
        description: a.description,
      },
    ]),
  );

  const orderedArtworks: IllustrationArtworkObj[] = illustration.artworkIds.map(
    (id: string) => {
      const stringId = oid(id); // id is still an ObjectId
      const art = artworkMap.get(stringId);

      // TODO: This will likely need to change to a default image
      if (!art) throw new Error("Broken artwork reference");
      return art;
    },
  );

  return {
    id: oid(illustration._id),
    name: illustration.name,
    artworks: orderedArtworks,
  };
}
