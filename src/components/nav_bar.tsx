import Image from "next/image";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

function NavNar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed z-50 top-5 w-full">
      <div className="flex justify-between items-center px-6 sm:px-10 bg-white py-3 mx-4 sm:mx-20 rounded-full shadow-md relative">
        {/* Logo */}
        <Image src="/logo.png" alt="logo" width={40} height={40} />

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-row gap-8">
          <Link
            href="/"
            className="text-md text-slate-800 cursor-pointer hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            href="/collections"
            className="text-md text-slate-800 cursor-pointer hover:text-blue-600"
          >
            Gallery
          </Link>
          <Link
            href="/shop"
            className="text-md text-slate-800 cursor-pointer hover:text-blue-600"
          >
            Shop
          </Link>
        </div>

        {/* Menu Button for Small Screens */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-800 focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Get Started Button for Desktop */}
        <div className="hidden md:block">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-700 transition-all">
            Get Started
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Small Screens */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full shadow-md rounded-b-lg z-40">
          <div className="flex flex-col py-4 items-center bg-white">
            <Link
              href="/"
              className="px-6 py-2 text-md text-slate-800 cursor-pointer hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              href="/collections"
              className="px-6 py-2 text-md text-slate-800 cursor-pointer hover:bg-gray-100"
            >
              Gallery
            </Link>
            <Link
              href="/shop"
              className="px-6 py-2 text-md text-slate-800 cursor-pointer hover:bg-gray-100"
            >
              Shop
            </Link>
            <div className="px-6 mt-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-3xl w-full hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavNar;
