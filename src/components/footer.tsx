import { currentYear } from "@/lib/helper";
import React from "react";

function Footer() {
  return (
    <footer className="h-auto py-10 flex flex-col items-center bg-blue-lightsky px-6 md:px-12 lg:px-20">
      <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between gap-4 sm:gap-8 text-center sm:text-left text-base md:text-lg font-medium">
        <label className="cursor-pointer hover:text-blue-700 transition">
          Explore Artful Threads
        </label>
        <label className="cursor-pointer hover:text-blue-700 transition">
          Our Collection
        </label>
        <label className="cursor-pointer hover:text-blue-700 transition">
          Purchase Art
        </label>
        <label className="cursor-pointer hover:text-blue-700 transition">
          Meet Our Artists
        </label>
      </div>

      <p className="text-xs sm:text-sm mt-8 text-center text-gray-700">
        © <span className="font-semibold">Coreweave</span> {currentYear}, Where
        Creativity Meets Craftsmanship
      </p>
    </footer>
  );
}

export default Footer;
