import { currentYear } from "@/lib/helper";
import React from "react";

function Footer() {
  return (
    <footer className="h-[15rem] flex justify-center items-center bg-blue-lightsky flex-col px-4 md:px-10">
      <div className="flex flex-col sm:flex-row lg:gap-10 gap-4  text-center sm:text-left">
        <label>Explore Artful Threads</label>
        <label>Our Collection</label>
        <label>Purchase Art</label>
        <label>Meet Our Artists</label>
      </div>
      <p className="text-sm mt-10 text-center">
        © <span className="font-semibold">Codeweave</span> {currentYear}, Where
        Creativity Meets Craftsmanship
      </p>
    </footer>
  );
}

export default Footer;
