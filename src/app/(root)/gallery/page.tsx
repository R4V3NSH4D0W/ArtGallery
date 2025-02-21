export const dynamic = "force-dynamic";
import ImageSlider from "@/components/image_slider";
import MotionDiv from "@/components/motiondiv";
import ReviewSection from "@/components/review";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { Suspense } from "react";
import { FaBrush, FaRulerCombined } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getGalleryArts } from "@/app/actions/gallery";
import { getArtDimensions } from "@/app/actions/art-dimensions";
import { getTopReviews } from "@/app/actions/top-review";

const LazyArtCollection = React.lazy(
  () => import("@/components/art-collection")
);
const LazyArtPiecesTable = React.lazy(
  () => import("@/components/artpiece_table")
);

async function Gallery() {
  const [galleryArts, artDimensions, topReviews] = await Promise.all([
    getGalleryArts(),
    getArtDimensions(),
    getTopReviews(),
  ]);
  return (
    <div className="flex flex-col min-h-screen mt-[5rem]">
      <div className=" mt-[2rem] lg:px-[10rem] px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/gallery">Gallery</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Suspense fallback={<div>Loading Art Collection...</div>}>
        <LazyArtCollection images={galleryArts} />
      </Suspense>
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
      {artDimensions.length > 0 && (
        <section className="px-[1rem] lg:px-[12rem] flex flex-col">
          <label className="text-4xl">Art Dimensions</label>
          <label className="text-stone-500 max-w-[30rem] mt-4">
            Understand the size and scale of each string art piece...
          </label>
          <Suspense fallback={<div>Loading Art Pieces Table...</div>}>
            <LazyArtPiecesTable artPieces={artDimensions} />
          </Suspense>
        </section>
      )}

      {/* Explore Techniques Section */}
      <section className="px-6 md:px-12 lg:px-[12rem] mt-4 flex flex-col items-center justify-center">
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
      {topReviews.length > 0 && (
        <section className="px-4 lg:px-[10rem] lg:pt-[10rem] mt-10 lg:mt-0">
          <div className="flex flex-col">
            <label className="text-2xl lg:text-4xl">
              Artful Threads Reviews
            </label>
            <label className="text-slate-500 pt-4 text-md lg:text-lg">
              {topReviews.length} Reviews
            </label>
          </div>
          <div className="py-10">
            <Suspense fallback={<div>Loading Reviews...</div>}>
              <ReviewSection reviews={topReviews} />
            </Suspense>
          </div>
        </section>
      )}
    </div>
  );
}

export default Gallery;
