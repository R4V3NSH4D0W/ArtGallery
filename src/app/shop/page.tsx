"use client";
import React from "react";
import Navbar from "../components/nav_bar";
import Footer from "../components/footer";
import { Button } from "@/components/ui/button";
import PurchaseGallery from "../components/purchase_gallery";
import Image from "next/image";
import PaymentMethod from "../components/paymet_method";
import MotionDiv from "../components/motiondiv";

function ShopPage() {
  return (
    <div className=" flex flex-col bg-gradient-to-r from-blue-lightsky to-blue-skyblue">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-[7rem] pb-[4rem] ">
        <label className=" text-md text-slate-800">
          Discover the Art of String: A Curated Collection
        </label>
        <div className=" flex flex-row gap-20 mt-10 justify-center items-center">
          <label className=" w-[20rem] text-md text-slate-500">
            Immerse yourself in our curated collection of string art, where each
            piece tells a story through intricate designs and vibrant colors.
          </label>
          <label className=" w-[20rem] text-md text-slate-500">
            Discover the artistry and craftsmanship of our unique string art
            pieces, perfect for adding a touch of creativity to any space.
          </label>
          <label className=" w-[20rem] text-md text-slate-500">
            Experience the mesmerizing interplay of threads and patterns that
            bring depth and dimension to your walls.
          </label>
        </div>
        <Button
          variant="secondary"
          className="flex rounded-3xl h-[3rem] w-[10rem] mt-10 bg-blue-600 text-white hover:bg-blue-800"
        >
          Explore Gallery
        </Button>
      </div>
      <section className=" lg:px-[8rem] px-2 pb-20">
        <PurchaseGallery />
      </section>
      {/* Art Price Section */}

      {/* <section className=" flex felx-col items-center justify-center bg-blue-lightsky py-20">
        <div className=" flex flex-col items-center justify-center">
          <label className=" text-md text-blue-600">
            Discover the Value of Artful Threads
          </label>
          <label className=" text-5xl text-slate-800 pt-5">Art Pricing</label>
          <label className=" text-slate-600 text-md mt-5">
            Choose the perfect piece that speaks to your artistic soul, with
            options for every budget.
          </label>
          <PricingTable />
        </div>
      </section> */}
      <section className=" flex flex-col items-center justify-center bg-blue-lightsky py-20">
        <div className=" flex flex-row gap-40 items-center">
          <MotionDiv className=" flex flex-col">
            <label className=" text-3xl font-medium">Shipping & Handling</label>
            <label className=" text-slate-500 mt-5">
              Ensuring your string art reaches you safely and swiftly.
            </label>
          </MotionDiv>
          <div className=" relative h-[20rem] w-[40rem] overflow-hidden rounded-lg">
            <Image
              src="https://w.wallhaven.cc/full/kx/wallhaven-kx5v57.jpg"
              fill
              alt=""
              objectFit="cover"
            />
          </div>
        </div>
        <div className=" grid grid-cols-3 gap-6 p-6 pt-20">
          <div className="flex flex-row gap-5 items-center">
            <label className="flex justify-center items-center h-[3rem] w-[3rem] bg-sky-600 text-white rounded-full">
              01
            </label>
            <div className="border-b-2 flex-grow" />
          </div>
          <div className="flex flex-row gap-5 items-center">
            <label className="flex justify-center items-center h-[3rem] w-[3rem] bg-sky-600 text-white rounded-full">
              02
            </label>
            <div className="border-b-2 flex-grow" />
          </div>
          <div className="flex flex-row gap-5 items-center">
            <label className="flex justify-center items-center h-[3rem] w-[3rem] bg-sky-600 text-white rounded-full">
              03
            </label>
            <div className="border-b-2 flex-grow" />
          </div>
          <div className=" text-xl font-medium">Place Your Order</div>
          <div className=" text-xl font-medium">Careful Packaging</div>
          <div className=" text-xl font-medium">Secure Delivery</div>
          <div className=" w-[25rem] text-slate-500">
            Select your desired art piece and complete the purchase process with
            ease
          </div>
          <div className=" w-[25rem] text-slate-500">
            Each piece is meticulously packaged to prevent damage during
            transit.
          </div>
          <div className=" w-[25rem] text-slate-500">
            Our trusted couriers ensure timely and safe delivery to your
            doorstep.
          </div>
        </div>
      </section>
      <section className="bg-blue-lightsky py-8">
        <MotionDiv>
          <div className="text-4xl  text-center">Art Purchase FAQs</div>
          <div className="border-b-[1px] w-[75%] mx-auto my-10" />
          <div className=" flex items-center justify-center">
            <div className=" grid grid-cols-3 gap-6 p-6  ">
              <label className=" text-xl font-medium">
                What is the return policy for art pieces?
              </label>
              <label className=" text-xl font-medium">
                How long does shipping take?
              </label>
              <label className=" text-xl font-medium">
                Can I request a custom art piece?
              </label>
              <label className=" w-[25rem] text-stone-500">
                We offer a 30-day return policy for undamaged art pieces. Please
                contact our support for assistance.
              </label>
              <label className=" w-[25rem] text-stone-500">
                Shipping typically takes 5-7 business days, depending on your
                location.
              </label>
              <label className=" w-[25rem] text-stone-500">
                Yes, we welcome custom requests. Please reach out to us with
                your ideas and requirements.
              </label>
            </div>
          </div>
        </MotionDiv>
      </section>
      {/* Payment method Section */}
      <PaymentMethod />

      <Footer />
    </div>
  );
}

export default ShopPage;
