"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export function ShopSlider({ products }) {
  return (
    <section className="mb-16 relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-16 before:h-full before:bg-gradient-to-r before:from-gray-50 before:via-gray-50/50 before:to-transparent before:z-10 before:pointer-events-none after:content-[''] after:absolute after:right-0 after:top-0 after:w-16 after:h-full after:bg-gradient-to-l after:from-gray-50 after:via-gray-50/50 after:to-transparent after:z-10 after:pointer-events-none">
      <Carousel
        plugins={[Autoplay({ delay: 2500 })]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="p-2">
                <div className="relative aspect-square h-96 rounded-xl overflow-hidden group">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-xl font-bold text-white">
                      {product.name}
                    </h3>
                    <p className="text-lg text-white">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden md:inline-flex z-20" />
        <CarouselNext className="right-4 hidden md:inline-flex z-20" />
      </Carousel>
    </section>
  );
}
