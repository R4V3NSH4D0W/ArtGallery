import { FaTruck, FaPalette } from "react-icons/fa";
import prisma from "@/lib/prisma";
import ImageGallery from "@/components/product/image-gallery";
import Buttons from "@/components/product/buttons";
import NotFoundPage from "@/app/not_found";
import WishListIcon from "@/components/product/wishlist-icon";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetail({ params }: Props) {
  const id = (await params).id;
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[4rem] lg:mt-[6rem] relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
        {/* Image Gallery */}
        <ImageGallery product={product} />

        {/* Product Details */}
        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Header with Buy Now Button */}
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
            <WishListIcon />
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
          {((product.length && product.width && product.breadth) ||
            (product.material && product.material.length > 0) ||
            (product.category && product.category.length > 0)) && (
            <div className="grid grid-cols-2 gap-4">
              {product.length && product.width && product.breadth && (
                <div className="p-4 bg-background rounded-xl border">
                  <h4 className="text-xs md:text-sm font-semibold uppercase text-gray-500 mb-1">
                    Dimensions
                  </h4>
                  <p className="font-medium text-xs md:text-sm">
                    {product.length} cm x {product.width} cm x {product.breadth}{" "}
                    cm
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

          <Buttons id={product.id} stockQuantity={product.quantity} />
        </div>
      </div>
    </div>
  );
}

// Dropdown Menu Component
