import { Artwork } from "@/models";
import Illustration from "@/models/Illustration";
import { oid } from "@/utils/objectIdToString";

interface IllustrationLean {
  _id: string;
  name: string;
  artworkIds: string[];
}

export interface IllustrationAggResult {
  id: string;
  name: string;
  artworkIds: string[];
  artworks: IllustrationArtworkObj[];
}

export interface IllustrationArtworkObj {
  id: string;
  name: string;
  src: string;
  thumbSrc: string;
  description: string;
}

export async function getIllustrationWithOrderedArtworks(slug: string) {
  const pipeline = [
    { $match: { slug: slug } },
    {
      $lookup: {
        from: "artworks",
        localField: "artworkIds",
        foreignField: "_id",
        as: "artworks",
      },
    },
    {
      $addFields: {
        artworks: {
          $map: {
            input: "$artworkIds",
            as: "id",
            in: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$artworks",
                    as: "art",
                    cond: { $eq: ["$$art._id", "$$id"] },
                  },
                },
                0,
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        artworks: {
          $filter: {
            input: "$artworks",
            as: "art",
            cond: { $ne: ["$$art", null] },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: 1,
        artworIds: {
          $map: {
            input: "$artworkIds",
            as: "id",
            in: { $toString: "$$id" },
          },
        },
        artworks: {
          $map: {
            input: "$artworks",
            as: "art",
            in: {
              id: { $toString: "$$art._id" },
              name: "$$art.name",
              src: "$$art.src",
              thumbSrc: "$$art.thumbSrc",
              description: "$$art.description",
            },
          },
        },
      },
    },
  ];

  const results = await Illustration.aggregate<IllustrationAggResult>(pipeline);

  const illustration = results[0] ?? null;

  return illustration;
}
