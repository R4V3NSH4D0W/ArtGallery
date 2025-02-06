"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaTruck, FaPalette } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ProductResponse } from "@/lib/types";
import { BeatLoader } from "react-spinners";

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true); // Set loading to true when fetching data
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
            setLoading(false); // Set loading to false once data is fetched
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          router.push("/not_found");
          setLoading(false); // Ensure loading state is false on error
        });
    }
  }, [id, router]);

  if (loading) {
    // Show loading spinner while fetching the product
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BeatLoader size={15} color="black" loading={loading} />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>; // Handle product not found
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-[3rem] lg:mt-[5rem]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Image Gallery */}
        <div className="relative group">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={selectedImage!}
              alt="Product"
              fill
              className="object-cover "
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
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
        <div className="flex flex-col gap-6 top-20 h-fit">
          {/* Header */}
          <div className="space-y-2">
            <Typography
              variant="h1"
              className="text-4xl font-bold tracking-tight"
            >
              {product.name}
            </Typography>
            <Typography variant="h3" className=" font-semibold text-primary">
              NRS {product.price.toLocaleString()}
            </Typography>
            {/* In Stock Display */}
            <Typography variant="p" className=" text-gray-600">
              {product.quantity > 0
                ? ` ${product.quantity} In Stock`
                : "Out of Stock"}
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
            variant="span"
            className=" leading-relaxed  dark:text-gray-300"
          >
            {product.description}
          </Typography>

          {/* Dimensions, Material, and Category Section */}
          {(product.dimensions ||
            (product.material && product.material.length > 0) ||
            (product.category && product.category.length > 0)) && (
            <div className="grid grid-cols-2  gap-4">
              {/* Dimensions */}
              {product.dimensions && (
                <div className="p-4 bg-background rounded-xl border">
                  <h4 className="text-sm font-semibold uppercase text-gray-500 mb-1">
                    Dimensions
                  </h4>
                  <p className="font-medium">
                    {product.dimensions.length} cm x {product.dimensions.width}{" "}
                    cm x {product.dimensions.breadth} cm
                  </p>
                </div>
              )}
              {/* Material */}
              {product.material && product.material.length > 0 && (
                <div className="p-4 bg-background rounded-xl border">
                  <h4 className="text-sm font-semibold uppercase text-gray-500 mb-1">
                    Material
                  </h4>
                  <p className="font-medium">{product.material.join(", ")}</p>
                </div>
              )}
              {/* Category */}
              {product.category && product.category.length > 0 && (
                <div className="p-4 bg-background rounded-xl border">
                  <h4 className="text-sm font-semibold uppercase text-gray-500 mb-1">
                    Category
                  </h4>
                  <p className="font-medium">{product.category.join(", ")}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
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

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t lg:hidden p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <p className="text-primary font-bold text-xl">
              NRS {product.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">{product.quantity} In stock</p>
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
