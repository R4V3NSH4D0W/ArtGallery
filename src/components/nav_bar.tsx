"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const deviceWidth = window.screen.width;

  const handleScroll = () => {
    if (window.scrollY > pageHeight / 2) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }

    if (window.scrollY > lastScrollY && window.scrollY > pageHeight / 2) {
      setIsVisible(false);
    } else if (window.scrollY < lastScrollY) {
      setIsVisible(true);
    }

    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    const updatePageHeight = () => {
      setPageHeight(document.documentElement.scrollHeight);
    };

    updatePageHeight();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updatePageHeight);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePageHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScrollY, pageHeight]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav
      className={`transition-all z-50 fixed top-5 lg:left-1/2 transform ml-4 lg:ml-0 lg:-translate-x-1/2 w-[100%] rounded-3xl bg-slate-200 ${
        isFixed ? "py-2" : "py-2"
      } ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{
        width: `${deviceWidth - 40}px`,
      }}
    >
      <div className="px-4 sm:px-8 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Image src="/logo.png" alt="logo" width={40} height={40} />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Links for Larger Screens */}
        <ul className="hidden md:flex space-x-6 text-sm md:text-base">
          <li>
            <Link href="/home">Home</Link>
          </li>
          <li>
            <a href="/collections">Gallery</a>
          </li>
          <li>
            <a href="/shop">Shop</a>
          </li>
        </ul>

        {/* Call-to-Actions for Larger Screens */}
        <ul className="hidden md:flex space-x-6">
          <li className="flex flex-row gap-2 items-center cursor-pointer">
            Join us <FaArrowRight />
          </li>
          <li className="flex flex-row gap-2 items-center bg-blue-500 py-1 px-4 rounded-3xl text-white cursor-pointer">
            Contact us <FaArrowRight />
          </li>
        </ul>

        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-200 shadow-lg  rounded-3xl p-4 md:hidden">
            <ul className="flex flex-col space-y-4 text-sm text-center">
              <li>
                <Link href="/home">Home</Link>
              </li>
              <li>
                <a href="/collections">Gallery</a>
              </li>
              <li>
                <a href="/shop">Shop</a>
              </li>
            </ul>
            <ul className="flex flex-col space-y-4 mt-6 text-sm text-center">
              <li className="flex flex-row justify-center gap-2 items-center cursor-pointer">
                Join us <FaArrowRight />
              </li>
              <li className="flex flex-row justify-center gap-2 items-center bg-blue-500 py-1 px-4 rounded-3xl h-[3rem] text-white cursor-pointer">
                Contact us <FaArrowRight />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
