import ChatBot from "@/components/chat-bot";
import HeroSection from "@/components/hero_section";
import MotionDiv from "@/components/motiondiv";
import {
  creatorsData,
  gridData,
  officeData,
  socialMediaLinks,
} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight, FaLinkedin, FaMagic } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
function Home() {
  return (
    <>
      <div className="flex flex-col">
        <HeroSection />
        {/* Grid Section */}
        <section className="bg-blue-dark px-4 md:px-10 lg:px-60 py-10 lg:py-20">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side */}
            <div className="flex flex-col">
              <h2 className="text-3xl lg:text-5xl xl:text-6xl text-white leading-tight">
                Craftmanship Meets Creativity
              </h2>
              <p className="text-sm lg:text-lg text-stone-300 mt-6 max-w-[50ch]">
                Discover the beauty of handcrafted string art where precision,
                passion, and creativity come together to form mesmerizing
                designs.
              </p>
              <Link
                href={"/shop"}
                className="bg-blue-500 hover:bg-blue-300 text-white mt-6 w-full lg:w-[10rem] h-[3rem] flex items-center justify-center rounded-md"
              >
                <FaArrowRight className="mr-2" />
                Discover Art
              </Link>
            </div>

            {/* Right Side - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gridData.map((item, index) => (
                <MotionDiv
                  key={index}
                  className="flex border-[1px] min-h-[14rem] flex-col rounded-lg p-6 border-blue-strong hover:bg-blue-strong cursor-pointer"
                >
                  <div className="text-blue-300 text-3xl">{item.icon}</div>
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
            <h3 className="text-2xl lg:text-4xl">Our String Art Creators</h3>
            <p className="text-sm lg:text-lg mt-4">
              Meet the talented artists whose passion and vision bring String
              Art to life.
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

        <MotionDiv className="lg:px-40 px:20 pl-4  flex flex-col lg:flex-row mt-20 items-center mb-8">
          <div className=" relative h-[30rem]  lg:h-[40rem] w-[100%] lg:w-[40rem] rounded-l-lg lg:rounded-lg overflow-hidden">
            <Image
              src="/gallary_static/12021dfa8eb0dc7a06e22b17b7de92d7.jpg"
              alt="Threads"
              fill
              objectFit="cover"
            />
          </div>
          <div className=" flex flex-col pb-5  mt-5 lg:mt-0 px-4 lg:px-0 lg:pl-20 lg:w-[50%]">
            <div className=" flex flex-row items-center gap-4">
              <FaMagic />
              <label className=" text-2xl lg:text-3xl">String Art</label>
            </div>
            <label className=" mt-10 text-md lg:text-xl">
              String Art transformed my living space with their stunning string
              art. It&apos;s a conversation starter for every visitor.
            </label>
            <label className=" mt-5  text-md lg:text-xl text-slate-500">
              The attention to detail and creativity in each piece is
              remarkable. I couldn’t be happier with my purchase.
            </label>
            <label className=" 10 text-md lg:text-xl mt-5 text-slate-600">
              Bishal Khadgi, Creator
            </label>
          </div>
        </MotionDiv>
        {/* Connect with Us */}
        <div className="relative mt-20 flex flex-col lg:flex-row bg-blue-lightsky h-auto lg:h-[35rem]">
          {/* Left Section */}
          <div className="relative h-[15rem] lg:h-[25rem] w-full lg:w-[50%] bg-blue-skyblue">
            <div className="absolute h-[15rem] lg:h-[24rem] w-[80%] lg:w-[36rem] right-4 lg:right-10 top-[-20px] lg:top-[-40px] rounded-lg overflow-hidden">
              <Image
                src={"/gallary_static/bfcbaa8bdb924308e71a53540832014a.jpg"}
                alt="straw"
                fill
                objectFit="cover"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="relative w-full lg:w-[50%] px-6 lg:px-10 mt-10 lg:mt-[5rem] flex flex-col">
            <h3 className="text-2xl md:text-3xl lg:text-4xl ">
              Connect with Us
            </h3>

            {/* Office Data */}
            <div className="flex flex-wrap gap-6 lg:gap-8 my-6">
              {officeData.map((office, index) => (
                <div key={index} className="flex flex-row gap-4">
                  {/* Icon */}
                  <div className="mt-1 text-blue-500 text-2xl">
                    {office.icon}
                  </div>

                  {/* Office Details */}
                  <div className="flex flex-col">
                    <h4 className="text-lg md:text-xl  ">{office.title}</h4>
                    <p className="pt-2 lg:pt-3 text-slate-400 text-sm md:text-base leading-relaxed">
                      {office.details?.city ||
                        office.details?.days ||
                        office.details?.phone1}
                    </p>
                    <p className="pt-2 lg:pt-3 text-slate-400 text-sm md:text-base leading-relaxed">
                      {office.details?.time || office.details?.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-wrap py-10 items-center justify-center gap-6 sm:gap-10">
          {socialMediaLinks.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-2 text-center text-base sm:text-lg"
            >
              <div>{item.icon}</div>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <ChatBot />
      </div>
    </>
  );
}

export default Home;
