import { Collections } from "@/lib/data";
import Image from "next/image";
import React from "react";

function ArtCollection() {
  return (
    <div className="lg:px-[10rem] px-4 flex flex-wrap gap-4 mt-10">
      {Collections.map((collection, index) => (
        <div
          key={index}
          className="relative h-[20rem] w-[100%] lg:w-[32.33%] rounded-tr-3xl rounded-bl-3xl overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 z-10 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          <Image
            src={collection.image}
            alt={collection.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-110"
          />
          {/* Gradient at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[5rem] bg-gradient-to-t from-slate-900 to-transparent z-20" />
          <div className="absolute z-30 bottom-2 left-2 text-white">
            {collection.name}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArtCollection;
