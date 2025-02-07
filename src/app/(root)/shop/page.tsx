"use client";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BeatLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface IProducts {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  images: string[];
  createdAt: string;
  status: string;
}

const categories = [
  "All",
  "Geometry",
  "Abstract",
  "Impressionism",
  "Cubism",
  "Surrealism",
  "Expressionism",
  "Minimalism",
  "Pop Art",
];
const types = ["All", "New"];
const LIMIT = 6;

async function getProducts(
  category: string,
  type: string,
  offset: number,
  limit: number
) {
  const categoryQuery = category !== "All" ? `category=${category}` : "";
  const typeQuery = type !== "All" ? `status=${type}` : "";

  const queryParams = [
    categoryQuery,
    typeQuery,
    `offset=${offset}`,
    `limit=${limit}`,
  ]
    .filter(Boolean)
    .join("&");

  const response = await fetch(`/api/products?${queryParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return await response.json();
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [products, setProducts] = useState<IProducts[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getProducts(
          activeCategory,
          activeType,
          offset,
          LIMIT
        );
        setProducts(data.products);
        setTotal(data.totalProducts);
      } catch {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, activeType, offset]);

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setOffset(0); // Reset offset when changing category
  };

  return (
    <div className="container mx-auto px-4 mt-[6rem] lg:mt-[7rem]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <aside className="w-full md:w-1/4">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <h3 className="text-lg font-semibold mt-6 mb-3">Type</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  activeType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </aside>

        <section className="w-full md:w-3/4">
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <BeatLoader size={15} color="#000000" loading={loading} />
            </div>
          ) : products.length === 0 ? (
            <div className="w-full text-center py-20 ">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Oops! No products found
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We couldn&apos;t find any products in this category. Try another
                filter or check back later!
              </p>
              <Link
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-full  hover:bg-blue-700 transition-all"
              >
                Go Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all relative"
                >
                  <Link href={`/detail/${product.id}`}>
                    <div className="relative w-full h-36 lg:h-64">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <FaHeart
                      className={`text-lg ${
                        wishlist.includes(product.id)
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <div className="px-2 pb-2 lg:px-4 lg:pb-4">
                    <h3 className="font-bold text-sm lg:text-md mt-3 mb-1 text-gray-900">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 lg:gap-2">
                      {Array.isArray(product.category)
                        ? product.category.map((cat, index) => (
                            <span
                              key={index}
                              className="bg-blue-500 px-2 py-1 text-white rounded-lg text-xs hover:bg-blue-600 transition-all"
                            >
                              {cat}
                            </span>
                          ))
                        : null}
                    </div>
                    <p className="font-semibold text-sm lg:text-md mt-2 text-gray-800">
                      NRS {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-6 mb-6">
            <div className="text-sm lg:text-md text-muted-foreground">
              Showing{" "}
              <strong>
                {products.length > 0
                  ? `${offset + 1} - ${Math.min(offset + LIMIT, total)}`
                  : "0"}{" "}
              </strong>{" "}
              of <strong>{total}</strong> products
            </div>

            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                disabled={offset === 0}
              >
                <ChevronLeft className="h-6 w-6" />
                <label className="text-sm lg:text-md">Prev</label>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  if (offset + LIMIT < total) {
                    setOffset(offset + LIMIT);
                  } else {
                    setOffset(total - LIMIT);
                  }
                }}
                disabled={offset + LIMIT >= total}
              >
                <label className="text-sm lg:text-md">Next</label>
                <ChevronRight className=" h-6 w-6" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
