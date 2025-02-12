"use client";
import Image from "next/image";
import React, { useState } from "react";

interface IImageGallery {
  product: { images: string[] };
}

function ImageGallery({ product }: IImageGallery) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="relative group">
      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
        <Image
          src={selectedImage}
          alt="Product"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* Thumbnails Carousel */}
      <div className="flex gap-4 mt-4 lg:mt-6 overflow-x-auto pb-2">
        {product.images.map((img, index) => (
          <div
            key={index}
            className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            <Image
              src={img}
              alt="Thumbnail"
              fill
              className={`object-cover rounded-xl transition-all ${
                selectedImage === img
                  ? "ring-3 ring-primary scale-105"
                  : "opacity-75 hover:opacity-100 hover:scale-105"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
