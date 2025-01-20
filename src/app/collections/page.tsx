"use client";
import React, { useState } from "react";
import Navbar from "../components/nav_bar";
import { Collections, CollectionTypes } from "@/lib/data";
import MotionDiv from "../components/motiondiv";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Footer from "../components/footer";
import ImageSlider from "../components/image_slider";
import ArtPiecesTable from "../components/artpiece_table";
import { IoIosColorPalette } from "react-icons/io";
import { FaBrush, FaRulerCombined } from "react-icons/fa";
import ReviewSection from "../components/review";

function CollectionPage() {
  const [selectedType, setSelectedType] = useState<number>(1);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <MotionDiv className="flex flex-row gap-2 mt-[7rem] lg:px-[10rem] px-4 flex-wrap">
        {CollectionTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`border px-10 rounded-3xl py-2 cursor-pointer ${
              selectedType === type.id
                ? " bg-blue-skyblue text-blue-900"
                : "hover:bg-blue-background hover:text-white"
            }`}
          >
            {type.type}
          </div>
        ))}
      </MotionDiv>
      {/* content */}
      <div className="lg:px-[10rem] px-4 flex flex-wrap gap-4 mt-10">
        {Collections.map((collection, index) => (
          <div
            key={index}
            className="relative h-[20rem] w-[100%] lg:w-[32.33%] rounded-sm overflow-hidden group cursor-pointer"
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
      {/* discover section */}
      <section className="lg:px-[12rem] px-2 flex flex-col py-[5rem]">
        <label className=" text-lg text-blue-600 mb-4">
          Inspired by Nature and Imagination
        </label>
        <label className=" text-4xl">Captivating Craftsmanship</label>
        <div className=" flex flex-col lg:flex-row mt-[3rem] justify-between text-slate-600">
          <div className=" lg:w-[50%] flex flex-col">
            <label>
              Each string art piece is a unique expression of creativity,
              meticulously crafted to inspire and captivate.
            </label>
            <label className=" mt-[2rem]">
              Our collection celebrates the fusion of traditional craftsmanship
              with modern artistic vision.
            </label>
            <Button
              variant="secondary"
              className=" w-[10rem] px-10 py-6 bg-blue-400 text-white hover:bg-blue-700 mt-10"
            >
              Discover More
            </Button>
          </div>
          <label className=" mt-10 lg:mt-0">
            Discover the stories and techniques behind our art, where
            imagination meets precision.
          </label>
        </div>
      </section>

      <MotionDiv className="relative flex items-center justify-center w-[95%] lg:w-[70%] h-[40rem] overflow-hidden mx-auto mb-10 rounded-t-lg">
        <Image
          src={"/art/kelly-sikkema-n4-ev9L8KHc-unsplash.jpg"}
          alt="art"
          fill
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute bottom-0 left-0 right-0 h-[4rem] bg-gradient-to-t from-white to-transparent z-20 opacity-90" />
      </MotionDiv>
      <main className="flex min-h-screen flex-col items-center justify-center py-2 px-[10rem]">
        <ImageSlider />
      </main>
      <section className=" px-[12rem] flex flex-col">
        <label className=" text-4xl"> Art Dimensions</label>
        <label className=" text-stone-500 max-w-[30rem] mt-4">
          Understand the size and scale of each string art piece to find the
          perfect fit for your space.
        </label>
        <MotionDiv className=" mt-10 mb-20">
          <ArtPiecesTable />
        </MotionDiv>
      </section>
      {/* Explore section */}
      <section className=" px-[12rem] flex flex-col items-center justify-center ">
        <label className=" text-blue-600 text-lg pb-2">
          Explore Our Techniques
        </label>
        <label className=" text-3xl">
          Discover the Materials and Methods Behind Our Art
        </label>
        <div className=" border-b-2 w-[60%]  mt-10 mb-5" />

        <div className=" flex flex-row gap-20">
          <div className=" flex flex-row items-center gap-2">
            <IoIosColorPalette className=" text-blue-600 text-lg" />
            <label className=" text-lg text-slate-500">
              Vibrant Color Palettes
            </label>
          </div>
          <div className=" flex flex-row items-center gap-2">
            <FaRulerCombined className=" text-blue-600 text-lg" />
            <label className=" text-lg text-slate-500">
              Precision Craftsmanship
            </label>
          </div>
          <div className=" flex flex-row items-center gap-2">
            <FaBrush className=" text-blue-600 text-lg" />
            <label className=" text-lg text-slate-500">
              Innovative Techniques
            </label>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className=" px-[10rem] pt-[10rem]">
        <div className=" flex flex-col">
          <label className=" text-4xl">Artful Threads Reviews</label>
          <label className=" text-slate-500 pt-4">5 Reviews</label>
        </div>
        <div className=" py-10">
          <ReviewSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CollectionPage;
