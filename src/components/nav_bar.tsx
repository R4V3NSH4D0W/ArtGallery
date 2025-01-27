import Image from "next/image";
import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Importing icons from lucide-react
import Link from "next/link";

function NavNar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className=" fixed  z-50 top-5 w-[80%] lg:w-full">
      <div className="flex flex-row justify-between items-center px-6 sm:px-10 bg-white py-2 mx-4 sm:mx-40 rounded-full shadow-md relative">
        {/* Logo */}
        <Image src="/logo.png" alt="logo" width={40} height={40} />

        {/* Desktop Menu */}
        <div className="hidden sm:flex flex-row gap-10">
          <Link href="/" className="text-md text-slate-800 cursor-pointer">
            Home
          </Link>
          <Link
            href="/collections"
            className="text-md text-slate-800 cursor-pointer"
          >
            Gallery
          </Link>
          <Link href="/shop" className="text-md text-slate-800 cursor-pointer">
            Shop
          </Link>
        </div>

        {/* Menu Button for Small Screens */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-800"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Get Started Button for Desktop */}
        <div className="hidden sm:block">
          <button className="bg-blue-600 text-white px-3 py-1 rounded-3xl">
            Get Started
          </button>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-b-lg">
            <div className="flex flex-col py-4">
              <label className="px-6 py-2 text-md text-slate-800 cursor-pointer hover:bg-gray-100">
                Home
              </label>
              <label className="px-6 py-2 text-md text-slate-800 cursor-pointer hover:bg-gray-100">
                Gallery
              </label>
              <label className="px-6 py-2 text-md text-slate-800 cursor-pointer hover:bg-gray-100">
                Shop
              </label>
              <div className="px-6 mt-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-3xl w-full">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavNar;
