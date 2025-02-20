"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { GalleryArt } from "@/lib/types";

function ArtCollection({ images }: { images: GalleryArt[] }) {
  console.log(images);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const closeLightbox = () => setCurrentImageIndex(null);

  const navigateImage = (direction: "prev" | "next") => {
    setCurrentImageIndex((prev) => {
      if (prev === null) return null;
      return direction === "prev"
        ? prev > 0
          ? prev - 1
          : images.length - 1
        : prev < images.length - 1
        ? prev + 1
        : 0;
    });
  };

  return (
    <div className="lg:px-[10rem] px-4 flex flex-wrap gap-4 mt-10">
      {images.map((collection, index) => (
        <div
          key={collection.id}
          onClick={() => openLightbox(index)}
          className="relative h-[20rem] w-[100%] lg:w-[32.33%] rounded-tr-3xl rounded-bl-3xl overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 z-10 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          <Image
            src={collection.images[0]}
            alt={`Artwork ${collection.id}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 h-[5rem] bg-gradient-to-t from-slate-900 to-transparent z-20" />
        </div>
      ))}

      {currentImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl w-full p-4">
            <Image
              src={images[currentImageIndex].images[0]}
              alt={`Enlarged artwork ${images[currentImageIndex].id}`}
              width={1200}
              height={800}
              className="rounded-lg object-contain w-full h-full"
              priority
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              ❮
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              ❯
            </button>

            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtCollection;
