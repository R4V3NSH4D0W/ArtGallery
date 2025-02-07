"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaTruck, FaPalette } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ProductResponse } from "@/lib/types";
import { BeatLoader } from "react-spinners";

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/products/${id}`)
        .then((response) => {
          if (!response.ok) {
            router.push("/not_found");
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setProduct(data);
            if (data.images && data.images.length > 0) {
              setSelectedImage(data.images[0]);
            }
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          router.push("/not_found");
          setLoading(false);
        });
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BeatLoader size={15} color="black" loading={loading} />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[4rem] lg:mt-[6rem] relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
        {/* Image Gallery */}
        <div className="relative group">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={selectedImage!}
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

        {/* Product Details */}
        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Header with Wishlist Icon for small screens */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl lg:text-4xl font-bold tracking-tight">
                {product.name}
              </h1>
              <h2 className="text-lg lg:text-3xl text-primary font-semibold">
                NRS {product.price.toLocaleString()}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                {product.quantity > 0
                  ? `${product.quantity} In Stock`
                  : "Out of Stock"}
              </p>
            </div>
            {/* Wishlist icon (only visible on small screens) */}
            <button
              className="block lg:hidden p-2 rounded-full bg-accent/20 shadow-lg"
              aria-label="Wishlist"
            >
              <FaHeart className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-xl">
              <FaPalette className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm lg:text-base">
                Handcrafted Design
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-xl">
              <FaTruck className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm lg:text-base">
                Free Shipping
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="leading-relaxed dark:text-gray-300 text-sm lg:text-base">
            {product.description}
          </p>

          {/* Dimensions, Material, and Category Section */}
          {(product.dimensions ||
            (product.material && product.material.length > 0) ||
            (product.category && product.category.length > 0)) && (
            <div className="grid grid-cols-2 gap-4">
              {product.dimensions && (
                <div className="p-4 bg-background rounded-xl border">
                  <h4 className="text-xs md:text-sm font-semibold uppercase text-gray-500 mb-1">
                    Dimensions
                  </h4>
                  <p className="font-medium text-xs md:text-sm">
                    {product.dimensions.length} cm x {product.dimensions.width}{" "}
                    cm x {product.dimensions.breadth} cm
                  </p>
                </div>
              )}
              {product.material && product.material.length > 0 && (
                <div className="p-4 bg-background rounded-xl border">
                  <h4 className="text-xs md:text-sm font-semibold uppercase text-gray-500 mb-1">
                    Material
                  </h4>
                  <p className="font-medium text-xs md:text-sm">
                    {product.material.join(", ")}
                  </p>
                </div>
              )}
              {product.category && product.category.length > 0 && (
                <div className="p-4 bg-background rounded-xl border">
                  <h4 className="text-xs md:text-sm font-semibold uppercase text-gray-500 mb-1">
                    Category
                  </h4>
                  <p className="font-medium text-xs md:text-sm">
                    {product.category.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Original Action Buttons (visible on larger screens) */}
          <div className="hidden lg:flex flex-col sm:flex-row gap-4 mt-4">
            <Button className="flex-1 h-14 text-lg gap-3 hover:scale-[1.02] transition-transform bg-blue-500 hover:bg-blue-600">
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
        </div>
      </div>

      <div className="fixed bottom-4 right-4 lg:hidden z-50">
        <Button
          className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transition duration-300"
          aria-label="Add to Cart"
        >
          <FaShoppingCart className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
