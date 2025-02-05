"use client";
import { useEffect, useState } from "react";

import { FaHeart, FaShoppingCart } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";
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

async function getProducts(search: string, offset: number, status: string) {
  const response = await fetch(
    `/api/products?q=${search}&offset=${offset}&status=${status}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return await response.json();
}

export default function ShopPage() {
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<IProducts[]>([]);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts("", 0, activeCategory);
        setProducts(data.products);
      } catch {
        console.error("Failed to load products");
      }
    }
    fetchProducts();
  }, [activeCategory]);

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase() &&
      (activeCategory === "all" || product.category === activeCategory) &&
      (priceFilter === "all" ||
        (priceFilter === "under50" && product.price < 50) ||
        (priceFilter === "50-100" &&
          product.price >= 50 &&
          product.price <= 100))
  );

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 mb-8 mt-[7rem]">
        <div className="flex flex-wrap gap-4 ">
          {["all", "new", "sale", "popular"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? " bg-blue-background text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 mb-8 flex lg:justify-end">
        <select
          className="px-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-black"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="all">All Prices</option>
          <option value="under NRP 5000">Under NRP 5000</option>
          <option value="5000- 1000000">NRP 5000 - above</option>
        </select>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-[20rem] overflow-hidden">
                <Link href={`/detail/${product.id}`}>
                  {/* Image with Hover Zoom Effect */}
                  <div className="w-full h-full transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      objectFit="cover"
                    />
                  </div>
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                >
                  <FaHeart
                    className={`text-lg ${
                      wishlist.includes(product.id)
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Product Info */}
                <div className="p-4 absolute bottom-0 bg-gradient-to-t from-black to-transparent w-full">
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    {product.name}
                  </h3>
                  <p className="text-white mb-4">
                    NRS {product.price.toLocaleString()}
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 border text-white py-2 rounded-lg hover:bg-blue-800 transition-colors hover:border-blue-800">
                    <FaShoppingCart className="text-lg" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
