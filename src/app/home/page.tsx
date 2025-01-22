"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaArrowRight, FaLinkedin, FaMagic } from "react-icons/fa";

import {
  creatorsData,
  gridData,
  officeData,
  socialMediaLinks,
} from "@/lib/data";
import { FaXTwitter } from "react-icons/fa6";

import AnimatedLine from "../components/animated_line";
import MotionDiv from "../components/motiondiv";
import Navbar from "../components/nav_bar";
import Footer from "../components/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-r from-blue-dark to-blue-background w-full min-h-screen relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-10 h-40 w-20 bg-black lg:h-[20rem] lg:w-[10rem]" />
        <div className="absolute top-0 left-[40%] bg-gradient-to-bl from-blue-dark to-transparent h-20 w-20 lg:h-[10rem] lg:w-[10rem]" />
        <div className="absolute bottom-[10%] left-[20%] bg-gradient-to-bl from-blue-dark to-transparent h-20 w-32 lg:h-[10rem] lg:w-[15rem]" />
        <div className="absolute bottom-5 left-[60%] bg-gradient-to-bl from-blue-dark to-transparent h-40 w-20 lg:h-[20rem] lg:w-[10rem]" />

        {/* Hero Section */}
        <div className="absolute top-[30%] left-6 lg:left-[10%] flex flex-col gap-4 lg:w-[40%]">
          <div className="flex flex-row gap-4 items-center">
            <label className="text-sm text-white bg-blue-600 px-4 py-1 rounded-3xl">
              FEATURED ARTIST
            </label>
            <label className="text-sm lg:text-md text-slate-400">
              Discover the Masterpieces of Bishal Strings
            </label>
          </div>
          <AnimatedLine width="70%" />
          <h1 className="text-4xl lg:text-6xl lg:w-[80%] text-white leading-snug">
            Weaving Dreams with Strings
          </h1>
          <p className="text-sm lg:text-lg text-slate-400 pt-4">
            Step into the enchanting world of Bishal Strings, where each thread
            tells a story and every knot captures imagination.
          </p>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <Button className="bg-blue-500 hover:bg-blue-300 text-white text-sm lg:text-md w-full lg:w-[12rem] h-[3rem]">
              View Bishal&apos;s Gallery
            </Button>
            <label className="text-slate-300 cursor-pointer flex flex-row items-center gap-2">
              Meet Bishal
              <FaArrowRight />
            </label>
          </div>
        </div>

        {/* Hero Image */}
        <div className="absolute top-40 right-0 h-80 w-3/4 lg:h-[70%] lg:w-[45%] rounded-l-lg overflow-hidden">
          <Image
            src="/stringart/string1.jpg"
            alt="Background"
            fill
            objectFit="cover"
            priority
          />
        </div>
      </div>

      {/* Grid Section */}
      <section className="bg-blue-dark px-4 lg:px-60 py-10 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col w-full lg:w-1/2">
            <h2 className="text-3xl lg:text-6xl text-white leading-tight">
              Craftmanship Meets Creativity
            </h2>
            <p className="text-sm lg:text-lg text-stone-300 mt-6">
              Explore the intricate designs and vibrant colors that define our
              string art collection, each piece a testament to exceptional
              craftsmanship.
            </p>
            <Button className="bg-blue-500 hover:bg-blue-300 text-white mt-6 w-full lg:w-[10rem] h-[3rem]">
              <FaArrowRight />
              Discover Art
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-1/2 ">
            {gridData.map((item, index) => (
              <MotionDiv
                key={index}
                className="flex border-[1px] h-[18rem] flex-col rounded-lg p-10 border-blue-strong hover:bg-blue-strong cursor-pointer"
              >
                <div className=" text-blue-300"> {item.icon}</div>
                <h3 className="text-lg font-bold mt-4 text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  {item.description}
                </p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Creators Section */}
      <div className="px-10 py-4 flex flex-col items-center mt-20">
        <MotionDiv className=" text-center">
          <h3 className="text-2xl lg:text-4xl">Our Artful Creators</h3>
          <p className="text-sm lg:text-lg mt-4">
            Meet the talented artists whose passion and vision bring Artful
            Threads to life.
          </p>
        </MotionDiv>
        <MotionDiv className=" flex flex-col lg:flex-row gap-10 mt-[5rem]">
          {creatorsData.map((item, index) => (
            <div key={index}>
              <div className="relative w-48 h-48 overflow-hidden rounded-full">
                <Image
                  src={item.image}
                  height={200}
                  width={200}
                  alt="Creator Image"
                  priority
                />
              </div>
              <div className=" flex flex-col items-center pt-5">
                <label className=" text-lg">{item.name}</label>
                <label className=" text-slate-500 text-md">
                  {item.position}
                </label>
              </div>
              <div className=" flex flex-row items-center justify-center gap-4 mt-5">
                <FaXTwitter />
                <FaLinkedin />
              </div>
            </div>
          ))}
        </MotionDiv>
      </div>
      {/* artful threads */}

      <MotionDiv className="lg:px-40 px:20 flex flex-col lg:flex-row mt-20 items-center">
        <div className=" relative h-[50rem] w-[40rem] rounded-lg overflow-hidden">
          <Image
            src="/stringart/string5.jpg"
            alt="Threads"
            fill
            objectFit="cover"
          />
        </div>
        <div className=" flex flex-col lg:pl-20 lg:w-[50%]">
          <div className=" flex flex-row items-center gap-4">
            <FaMagic />
            <label className=" text-3xl">Artful Threads</label>
          </div>
          <label className=" mt-10 text-xl">
            Artful Threads transformed my living space with their stunning
            string art. It&apos;s a conversation starter for every visitor.
          </label>
          <label className=" mt-5 text-xl text-slate-500">
            The attention to detail and creativity in each piece is remarkable.
            I couldn’t be happier with my purchase.
          </label>
          <label className=" text-lg mt-5 text-slate-600">
            Leslie Alexander, Interior Designer
          </label>
        </div>
      </MotionDiv>
      {/* Connect with Us */}
      <div className=" relative mt-20 flex bg-blue-lightsky h-[35rem]">
        <div className="absolute bottom-0 h-[25rem] w-[50%] bg-blue-skyblue">
          <MotionDiv className="absolute h-[24rem] w-[36rem] right-20 top-[-40px] rounded-lg overflow-hidden">
            <Image src={"/art/straw.jpg"} alt="straw" fill />
          </MotionDiv>
        </div>
        <div className=" absolute left-[58%] top-[18%] w-[35%]">
          <label className=" text-5xl">Connect with us</label>

          <div className=" flex flex-wrap gap-20 mt-10">
            {officeData.map((office, index) => (
              <MotionDiv key={index} className=" flex flex-row gap-5">
                <div className="mt-1 text-blue-500">{office.icon}</div>
                <div className=" flex flex-col">
                  <label className=" text-xl">{office.title}</label>
                  <label className=" pt-5 text-stone-500">
                    {office.details?.city ||
                      office.details?.days ||
                      office.details?.phone1}
                  </label>
                  <label className=" pt-5 text-slate-500">
                    {office.details?.time ||
                      office.details?.phone2 ||
                      office.details?.country}
                  </label>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
      {/* Social Media */}
      <MotionDiv className=" flex flex-row py-20 items-center justify-center gap-10">
        {socialMediaLinks.map((item, index) => (
          <div key={index} className=" flex flex-row items-center gap-2">
            <div>{item.icon}</div>
            {item.name}
          </div>
        ))}
      </MotionDiv>
      {/* Footer */}
      <Footer />

      <Navbar />
    </div>
  );
}
