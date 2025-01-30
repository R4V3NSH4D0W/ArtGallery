"use client";
import React from "react";
import Image from "next/image";

const ArtPiecesTable = () => {
  const artPieces = [
    {
      image: "https://w.wallhaven.cc/full/9d/wallhaven-9dp3y1.jpg",
      title: "Ethereal Patterns",
      size: "24x36 inches",
      material: "Cotton String on Canvas",
      price: "$450",
    },
    {
      image: "https://w.wallhaven.cc/full/9d/wallhaven-9dqojx.jpg",
      title: "Forest Symphony",
      size: "30x40 inches",
      material: "Silk String on Wood",
      price: "$600",
    },
    {
      image: "https://w.wallhaven.cc/full/vq/wallhaven-vq6x28.jpg",
      title: "Modern Whirl",
      size: "20x30 inches",
      material: "Polyester String on Metal",
      price: "$500",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse bg-white">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Art Piece
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Size
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Materials
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {artPieces.map((art, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center space-x-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image src={art.image} alt={art.title} fill />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {art.title}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{art.size}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {art.material}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{art.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArtPiecesTable;
