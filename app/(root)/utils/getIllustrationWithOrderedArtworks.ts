import Illustration from "@/models/Illustration";

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
  // pipeline needs to flesh out artwork objects, drop null references, 
  // and maintain the order of artwork objects relative to illustration.artworkIds
  // and shape object for IllustrationAggResult
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
