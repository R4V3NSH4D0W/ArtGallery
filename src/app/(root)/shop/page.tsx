"use client";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
const types = ["All", "New", "Sale", "Popular"];
const LIMIT = 6;

async function getProducts(
  category: string,
  type: string,
  offset: number,
  limit: number
) {
  const categoryQuery = category !== "All" ? `category=${category}` : "";
  const typeQuery = type !== "All" ? `status=${type}` : "";
  const response = await fetch(
    `/api/products?${categoryQuery}&${typeQuery}&offset=${offset}&limit=${limit}`
  );
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

  useEffect(() => {
    async function fetchProducts() {
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
    setOffset(0);
  };

  return (
    <div className="container mx-auto px-4 mt-[7rem]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all relative"
              >
                <Link href={`/detail/${product.id}`}>
                  <div className="relative w-full h-64">
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
                <div className="px-4 pb-4">
                  <h3 className="font-semibold text-md mt-3 text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                  <p className="font-semibold text-md mt-2 text-gray-800">
                    NRS {product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 mb-6">
            <p className="text-gray-700">
              Showing{" "}
              {products.length > 0
                ? `${offset + 1} - ${Math.min(offset + LIMIT, total)}`
                : "0"}{" "}
              out of {total} products
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                disabled={offset === 0}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                <FaChevronLeft className="text-lg text-gray-600" />
              </button>

              <button
                onClick={() => {
                  if (offset + LIMIT < total) {
                    setOffset(offset + LIMIT);
                  } else {
                    setOffset(total - LIMIT);
                  }
                }}
                disabled={offset + LIMIT >= total}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                <FaChevronRight className="text-lg text-gray-600" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
