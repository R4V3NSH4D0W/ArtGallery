import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

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

  return (
    <nav
      className={`transition-all z-50 fixed top-5 left-1/2  transform -translate-x-1/2 w-[90%] rounded-3xl bg-stone-200 ${
        isFixed ? "shadow-lg py-2" : " py-2"
      } ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="px-10 flex justify-between items-center">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <ul className="flex space-x-6 pl-[10rem]">
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
        <ul className="flex space-x-6">
          <li className=" flex flex-row gap-2 items-center">
            join us <FaArrowRight />
          </li>
          <li className=" flex flex-row gap-2 items-center bg-blue-500 py-1 rounded-3xl px-4 text-white">
            Contact us <FaArrowRight />
          </li>
        </ul>
      </div>
    </nav>
  );
}
