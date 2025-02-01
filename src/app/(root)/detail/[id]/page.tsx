"use client";

import { useState } from "react";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";

const product = {
  name: "Product Name",
  price: "$199",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, a ducimus id voluptatem at earum error delectus perspiciatis vero quisquam. Amet ullam cum animi libero reiciendis itaque ab in adipisci sapiente, deserunt officia eius dignissimos est, a dolore rerum incidunt reprehenderit tempore omnis quod et vero accusantium. Labore, excepturi earum!",
  images: [
    "/stringart/string1.jpg",
    "/stringart/string2.jpg",
    "/stringart/string3.jpg",
  ],
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 mt-[4rem] lg:mt-[6rem] max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 w-full">
        {/* Main Image (At the Top on Small Screens) */}
        <div className="relative w-full md:w-[400px] h-[350px] md:h-[500px]">
          <Image
            src={selectedImage}
            alt="Product"
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Small Thumbnails (Below on Small Screens, Side on Large Screens) */}
        <div className="flex flex-row gap-2">
          {product.images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="Product Image"
              width={70}
              height={90}
              className="cursor-pointer border rounded-lg hover:opacity-80"
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          {product.name}
        </h1>
        <p className="text-xl text-gray-700">{product.price}</p>
        <p className="text-gray-600">{product.description}</p>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-[15rem] flex items-center gap-2 justify-center">
            <FaShoppingCart className="text-lg" />
            Add to Cart
          </button>
          <button className="px-6 py-3 border text-black border-black rounded-lg hover:bg-blue-700 w-full md:w-[15rem]">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
