import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import AnimatedLine from "./animated_line";

function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-dark to-blue-background w-full min-h-screen relative">
      {/* Background Gradients */}
      <div className="absolute top-0 right-10 h-40 w-20 bg-black lg:h-[20rem] lg:w-[10rem]" />
      <div className="absolute top-0 left-[40%] bg-gradient-to-bl from-blue-dark to-transparent h-20 w-20 lg:h-[10rem] lg:w-[10rem]" />
      <div className="absolute bottom-[10%] left-[20%] bg-gradient-to-bl from-blue-dark to-transparent h-20 w-32 lg:h-[10rem] lg:w-[15rem]" />
      <div className="absolute bottom-5 left-[60%] bg-gradient-to-bl from-blue-dark to-transparent h-40 w-20 lg:h-[20rem] lg:w-[10rem]" />

      {/* Hero Section */}
      <div className="absolute top-[15%] lg:top-[30%] left-6 lg:left-[10%] flex flex-col gap-4 lg:w-[40%]">
        <div className="flex flex-row gap-4 items-center">
          <div className=" bg-blue-600 py-1 rounded-3xl flex justify-center w-auto px-4 lg:w-[15rem]">
            <label className=" text-xs lg:text-sm text-white">
              FEATURED ARTIST
            </label>
          </div>
          <label className="text-xs lg:text-md text-slate-400 w-[11rem] lg:w-full">
            Discover the Masterpieces of Bishal Strings
          </label>
        </div>
        <AnimatedLine width="70%" />
        <h1 className="text-3xl lg:text-6xl w-[80%] text-white leading-snug">
          Weaving Dreams with Strings
        </h1>
        <p className="text-sm lg:text-lg text-slate-400 pt-4">
          Step into the enchanting world of Bishal Strings, where each thread
          tells a story and every knot captures imagination.
        </p>
        <div className="flex flex-row gap-4 lg:items-center">
          <Button className="bg-blue-500 hover:bg-blue-300 text-white text-sm lg:text-md w-[12rem] h-[3rem]">
            View Bishal&apos;s Gallery
          </Button>
          <label className="text-slate-300 cursor-pointer flex flex-row items-center gap-2">
            Meet Bishal
            <FaArrowRight />
          </label>
        </div>
      </div>

      {/* Hero Image */}
      <div className="absolute bottom-5 lg:top-40 right-0 h-80  w-3/4 md:h-[25rem] lg:h-[70%] lg:w-[45%] rounded-l-lg overflow-hidden">
        <Image
          src="/stringart/stringart1.jpg"
          alt="Background"
          fill
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}

export default HeroSection;
