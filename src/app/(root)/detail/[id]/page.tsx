"use client";

import { useState } from "react";
import Image from "next/image";

const product = {
  name: "Product Name",
  price: "$199",
  description:
    " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, a ducimus id voluptatem at earum error delectus perspiciatis vero quisquam. Amet ullam cum animi libero reiciendis itaque ab in adipisci sapiente, deserunt officia eius dignissimos est, a dolore rerum incidunt reprehenderit tempore omnis quod et vero accusantium. Labore, excepturi earum!",
  images: [
    "/stringart/string1.jpg",
    "/stringart/string2.jpg",
    "/stringart/string3.jpg",
  ],
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 mt-[5rem] max-w-5xl mx-auto">
      <div className="flex gap-3">
        {/* Small Thumbnails */}
        <div className="flex flex-col gap-2">
          {product.images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="Product Image"
              width={80}
              height={100}
              className="cursor-pointer border rounded-lg hover:opacity-80"
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        {/* Main Image */}
        <div className="relative w-[400px] h-[500px]">
          <Image
            src={selectedImage}
            alt="Product"
            layout="fill"
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-lg text-gray-700">{product.price}</p>
        <p>{product.description}</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-[15rem]">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
