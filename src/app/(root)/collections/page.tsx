"use client";
import ImageSlider from "@/components/image_slider";
import MotionDiv from "@/components/motiondiv";
import ReviewSection from "@/components/review";
import { Button } from "@/components/ui/button";
import { CollectionTypes } from "@/lib/data";
import Image from "next/image";
import React, { useState, Suspense } from "react";
import { FaBrush, FaRulerCombined } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";

const LazyArtCollection = React.lazy(
  () => import("@/components/art-collection")
);
const LazyArtPiecesTable = React.lazy(
  () => import("@/components/artpiece_table")
);

function CollectionPage() {
  const [selectedType, setSelectedType] = useState<number>(1);

  return (
    <div className="flex flex-col min-h-screen">
      <MotionDiv className="flex flex-row gap-2 mt-[7rem] lg:px-[10rem] px-4 flex-wrap">
        {CollectionTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`border px-3 lg:px-10 rounded-3xl py-2 cursor-pointer ${
              selectedType === type.id
                ? "bg-blue-skyblue text-blue-900"
                : "hover:bg-blue-background hover:text-white"
            }`}
          >
            {type.type}
          </div>
        ))}
      </MotionDiv>

      {/* Content */}
      <Suspense fallback={<div>Loading Art Collection...</div>}>
        <LazyArtCollection />
      </Suspense>

      {/* Discover Section */}
      <section className="lg:px-[12rem] px-4 flex flex-col py-[4rem]">
        <label className="text-md lg:text-lg text-blue-600 mb-4">
          Inspired by Nature and Imagination
        </label>
        <label className="text-3xl lg:text-4xl">
          Captivating Craftsmanship
        </label>
        <div className="flex flex-col lg:flex-row mt-[1rem] lg:mt-[3rem] justify-between text-slate-600">
          <div className="lg:w-[50%] flex flex-col">
            <label>
              Each string art piece is a unique expression of creativity,
              meticulously crafted to inspire and captivate.
            </label>
            <label className="mt-[2rem]">
              Our collection celebrates the fusion of traditional craftsmanship
              with modern artistic vision.
            </label>
            <Button
              variant="secondary"
              className="w-[10rem] px-10 py-6 bg-blue-400 text-white hover:bg-blue-700 mt-5 lg:mt-10"
            >
              Discover More
            </Button>
          </div>
          <label className="mt-5 lg:mt-0">
            Discover the stories and techniques behind our art, where
            imagination meets precision.
          </label>
        </div>
      </section>

      {/* Image Section */}
      <MotionDiv className="relative flex items-center justify-center w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] h-[20rem] sm:h-[25rem] md:h-[30rem] lg:h-[40rem] overflow-hidden mx-auto mb-10 rounded-t-lg">
        <Image
          src={"/art/kelly-sikkema-n4-ev9L8KHc-unsplash.jpg"}
          alt="art"
          fill
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute bottom-0 left-0 right-0 h-[4rem] bg-gradient-to-t from-white to-transparent z-20 opacity-90" />
      </MotionDiv>

      <main className="flex lg:min-h-screen flex-col items-center justify-center py-2 px-4 lg:px-[10rem]">
        <ImageSlider />
      </main>

      {/* Art Dimensions Section */}
      <section className="px-[1rem] lg:px-[12rem] flex flex-col">
        <label className="text-4xl">Art Dimensions</label>
        <label className="text-stone-500 max-w-[30rem] mt-4">
          Understand the size and scale of each string art piece to find the
          perfect fit for your space.
        </label>
        <Suspense fallback={<div>Loading Art Pieces Table...</div>}>
          <LazyArtPiecesTable />
        </Suspense>
      </section>

      {/* Explore Techniques Section */}
      <section className="px-6 md:px-12 lg:px-[12rem] flex flex-col items-center justify-center">
        <label className="text-blue-600 text-lg pb-2">
          Explore Our Techniques
        </label>
        <label className="text-xl md:text-2xl lg:text-3xl text-center">
          Discover the Materials and Methods Behind Our Art
        </label>
        <div className="border-b-2 w-full sm:w-[80%] md:w-[60%] mt-10 mb-5" />

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-20 items-center">
          <div className="flex flex-row items-center gap-2">
            <IoIosColorPalette className="text-blue-600 text-xl sm:text-lg" />
            <label className="text-base md:text-lg text-slate-500">
              Vibrant Color Palettes
            </label>
          </div>
          <div className="flex flex-row items-center gap-2">
            <FaRulerCombined className="text-blue-600 text-xl sm:text-lg" />
            <label className="text-base md:text-lg text-slate-500">
              Precision Craftsmanship
            </label>
          </div>
          <div className="flex flex-row items-center gap-2">
            <FaBrush className="text-blue-600 text-xl sm:text-lg" />
            <label className="text-base md:text-lg text-slate-500">
              Innovative Techniques
            </label>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="px-4 lg:px-[10rem] lg:pt-[10rem] mt-10 lg:mt-0">
        <div className="flex flex-col">
          <label className="text-2xl lg:text-4xl">Artful Threads Reviews</label>
          <label className="text-slate-500 pt-4 text-md lg:text-lg">
            5 Reviews
          </label>
        </div>
        <div className="py-10">
          <ReviewSection />
        </div>
      </section>
    </div>
  );
}

export default CollectionPage;
