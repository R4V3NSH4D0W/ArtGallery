import React from "react";
import Image from "next/image";

const items = [
  {
    id: 1,
    title: "Elegant String Art Circle",
    price: "$45.00",
    image: "https://w.wallhaven.cc/full/1p/wallhaven-1p6d79.jpg",
  },
  {
    id: 2,
    title: "Abstract String Wave Patterns",
    price: "$60.00",
    image: "https://w.wallhaven.cc/full/ex/wallhaven-exk1m8.jpg",
  },
  {
    id: 3,
    title: "Intricate Geometric String Art",
    price: "$75.00",
    image: "https://w.wallhaven.cc/full/ex/wallhaven-exkqk8.jpg",
  },
  {
    id: 4,
    title: "Flowing Dynamic String Design",
    price: "$55.00",
    image: "https://w.wallhaven.cc/full/vq/wallhaven-vq83e5.jpg",
  },
  {
    id: 5,
    title: "Modern String Art Accent",
    price: "$80.00",
    image: "https://w.wallhaven.cc/full/d6/wallhaven-d61vgl.jpg",
  },
  {
    id: 6,
    title: "Creative Artistic String Fusion",
    price: "$50.00",
    image: "https://w.wallhaven.cc/full/gp/wallhaven-gprk9d.jpg",
  },
  {
    id: 7,
    title: "Minimalist String Circle Design",
    price: "$45.00",
    image: "https://w.wallhaven.cc/full/d6/wallhaven-d612rm.jpg",
  },
  {
    id: 8,
    title: "Waves of Abstract String Art",
    price: "$60.00",
    image: "https://w.wallhaven.cc/full/5g/wallhaven-5ge833.png",
  },
  {
    id: 9,
    title: "Symmetrical Geometric String Art",
    price: "$75.00",
    image: "https://w.wallhaven.cc/full/2y/wallhaven-2y7q2y.png",
  },
  {
    id: 10,
    title: "Dynamic Flowing String Patterns",
    price: "$55.00",
    image: "https://w.wallhaven.cc/full/rr/wallhaven-rrmz2m.jpg",
  },
  {
    id: 11,
    title: "Contemporary String Decor",
    price: "$80.00",
    image: "https://w.wallhaven.cc/full/2y/wallhaven-2y7w8g.jpg",
  },
  {
    id: 12,
    title: "Fusion of Artistic Strings",
    price: "$50.00",
    image: "https://w.wallhaven.cc/full/p9/wallhaven-p965lp.jpg",
  },
];

const PurchaseGallery = () => {
  return (
    <div className="px-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300">
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="text-sm font-semibold text-white z-10 transition-colors duration-200">
                View Details
              </button>
            </div>

            {/* Title and Price */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
              <h3 className="text-md font-semibold">{item.title}</h3>
              <p className="text-sm">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseGallery;
