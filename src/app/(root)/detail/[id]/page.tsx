"use client";

import { useState } from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaTruck, FaPalette } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

const product = {
  name: "Elegant String Art",
  price: "$199",
  description:
    "This handcrafted string art piece brings a unique geometric aesthetic to your space. Designed with precision and passion, it adds a modern and sophisticated touch to any room.",
  images: [
    "/stringart/string1.jpg",
    "/stringart/string2.jpg",
    "/stringart/string3.jpg",
  ],
  details: {
    materials: "Premium oak wood & cotton threads",
    dimensions: "60cm × 60cm × 2cm",
    shipping: "Free worldwide shipping",
  },
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [zoomActive, setZoomActive] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-[7rem]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Image Gallery */}
        <div className="relative group">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={selectedImage}
              alt="Product"
              fill
              className="object-cover cursor-zoom-in"
              onClick={() => setZoomActive(!zoomActive)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

            {/* Zoom Indicator */}
          </div>

          {/* Thumbnails Carousel */}
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <div
                key={index}
                className="relative shrink-0 w-24 h-24 cursor-pointer group"
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

        {/* Product Details */}
        <div className="flex flex-col gap-6  top-20 h-fit">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Typography
                variant="h1"
                className="text-4xl font-bold tracking-tight"
              >
                {product.name}
              </Typography>
            </div>

            <Typography
              variant="h2"
              className="text-3xl font-semibold text-primary"
            >
              {product.price}
            </Typography>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-accent/20 rounded-xl">
              <FaPalette className="w-6 h-6 text-primary" />
              <span className="font-medium">Handcrafted Design</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-accent/20 rounded-xl">
              <FaTruck className="w-6 h-6 text-primary" />
              <span className="font-medium">Free Shipping</span>
            </div>
          </div>

          {/* Description */}
          <Typography
            variant="p"
            className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          >
            {product.description}
          </Typography>

          {/* Product Specs */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="p-4 bg-background rounded-xl border">
                <h4 className="text-sm font-semibold uppercase text-gray-500 mb-1">
                  {key}
                </h4>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button className="flex-1 h-14 text-lg gap-3 hover:scale-[1.02] transition-transform">
              <FaShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-14 text-lg gap-3 border-2 hover:border-primary"
            >
              <FaHeart className="w-5 h-5" />
              Wishlist
            </Button>
          </div>

          {/* Trust Badges */}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomActive && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomActive(false)}
        >
          <div className="relative w-full max-w-4xl aspect-square">
            <Image
              src={selectedImage}
              alt="Zoomed Product"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t lg:hidden p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <p className="text-primary font-bold text-xl">{product.price}</p>
            <p className="text-sm text-gray-500">In stock</p>
          </div>
          <Button className="gap-2 flex-1 max-w-xs">
            <FaShoppingCart />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
