import { currentYear } from "@/lib/helper";
import React from "react";

function Footer() {
  return (
    <footer className="h-auto py-4 lg:py-12 flex flex-col items-center bg-blue-lightsky px-6 md:px-12 lg:px-20">
      <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between gap-2 sm:gap-10 text-center sm:text-left text-base md:text-lg font-medium">
        <label className="cursor-pointer hover:text-blue-700 transition-all duration-300 text-sm lg:text-base">
          Explore Artful Threads
        </label>
        <label className="cursor-pointer hover:text-blue-700 transition-all duration-300 text-sm lg:text-base">
          Our Collection
        </label>
        <label className="cursor-pointer hover:text-blue-700 transition-all duration-300 text-sm lg:text-base">
          Purchase Art
        </label>
        <label className="cursor-pointer hover:text-blue-700 transition-all duration-300 text-sm lg:text-base">
          Meet Our Artists
        </label>
      </div>

      <div className="mt-8 text-center text-gray-700 space-y-2">
        <p className="text-sm sm:text-base">
          © <span className="font-semibold">Coreweave</span> {currentYear},
          Where Creativity Meets Craftsmanship
        </p>
        <p className="text-xs text-gray-500">
          All Rights Reserved | Privacy Policy | Terms of Service
        </p>
      </div>
    </footer>
  );
}

export default Footer;
