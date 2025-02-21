"use client";

import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GalleryArt } from "@/lib/types";

export default function GalleryGrid({ arts }: { arts: GalleryArt[] }) {
  console.log(arts);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {arts.map((art) =>
          art.images.map((img, index) => (
            <Card
              key={`${art.id}-${index}`}
              className="mb-6 break-inside-avoid cursor-pointer group relative overflow-hidden"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt="Artwork"
                width={600}
                height={800}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Image
            src={selectedImage}
            alt="Fullscreen view"
            width={2000}
            height={2000}
            className="object-contain max-h-[90vh] rounded-lg shadow-xl"
          />
        </div>
      )}
    </>
  );
}
