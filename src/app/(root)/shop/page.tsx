"use client";
import { useState } from "react";

import { FaHeart, FaShoppingCart } from "react-icons/fa";

import Image from "next/image";
import { ShopSlider } from "@/components/shop-slider";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 49.99,
    category: "new",
    image: "/stringart/string1.jpg",
  },
  {
    id: 2,
    name: "Product 2",
    price: 79.99,
    category: "sale",
    image: "/stringart/string2.jpg",
  },
  {
    id: 3,
    name: "Product 2",
    price: 79.99,
    category: "sale",
    image: "/stringart/string3.jpg",
  },
  {
    id: 4,
    name: "Product 2",
    price: 79.99,
    category: "sale",
    image: "/stringart/string4.jpg",
  },
  {
    id: 5,
    name: "Product 2",
    price: 79.99,
    category: "sale",
    image: "/stringart/string5.jpg",
  },
  {
    id: 6,
    name: "Product 2",
    price: 79.99,
    category: "sale",
    image: "/stringart/string6.jpg",
  },
];

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === "all" || product.category === activeCategory) &&
      (priceFilter === "all" ||
        (priceFilter === "under50" && product.price < 50) ||
        (priceFilter === "50-100" &&
          product.price >= 50 &&
          product.price <= 100))
  );

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}

      {/* <ShopSlider products={products} /> */}

      {/* Categories */}
      <section className="container mx-auto px-4 mb-8 mt-[7rem]">
        <div className="flex flex-wrap gap-4 ">
          {["all", "new", "sale", "popular"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-black"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under50">Under $50</option>
            <option value="50-100">$50 - $100</option>
          </select>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-64 object-cover">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  objectFit="cover"
                />
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
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <FaShoppingCart className="text-lg" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
