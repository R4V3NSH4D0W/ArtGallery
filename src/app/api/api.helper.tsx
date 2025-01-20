// pages/api/collections.ts
import { NextApiRequest, NextApiResponse } from "next";

export const Collections = [
  {
    id: 1,
    name: "Abstract Art",
    type: "abstract",
    image: "https://w.wallhaven.cc/full/1p/wallhaven-1p6d79.jpg",
    description: "Abstract art piece 1.",
  },
  {
    id: 2,
    name: "Abstract Art",
    type: "abstract",
    image: "https://w.wallhaven.cc/full/zy/wallhaven-zywe5j.jpg",
    description: "Abstract art piece 2.",
  },
  {
    id: 3,
    name: "Modern Art",
    type: "modern",
    image: "https://w.wallhaven.cc/full/3l/wallhaven-3lp2md.jpg",
    description: "Modern art piece 1.",
  },
  {
    id: 4,
    name: "Classic Art",
    type: "classic",
    image: "https://w.wallhaven.cc/full/l8/wallhaven-l81qoy.png",
    description: "Classic art piece 1.",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  const filteredCollections = Collections.filter(
    (collection) => collection.type === type
  );

  if (filteredCollections.length === 0) {
    return res
      .status(404)
      .json({ error: "No collections found for this type" });
  }

  res.status(200).json(filteredCollections);
}
