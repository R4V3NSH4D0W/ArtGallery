import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Gallery" },
    // { href: "/shop", label: "Shop" },
  ];

  return (
    <nav className="fixed z-50 top-5 w-full">
      <div className="flex justify-between items-center px-6 sm:px-10 bg-white py-3 mx-4 sm:mx-20 rounded-full shadow-md relative">
        {/* Logo */}
        <div className="relative h-6 w-6 lg:h-10 lg:w-10">
          <Image src="/logo.png" alt="logo" fill />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-row gap-8 mx-20">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.div
                className={`text-md cursor-pointer w-full ${
                  pathname === link.href
                    ? "text-blue-600 font-bold"
                    : "text-slate-800"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {link.label}
                {/* Add underline animation for active link */}
                {pathname === link.href && (
                  <motion.div
                    className="h-[2px] bg-blue-600"
                    layoutId="underline"
                  />
                )}
              </motion.div>
            </Link>
          ))}
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
        <div className="hidden md:block ">
          <button
            className="  px-4 py-2 rounded-3xl transition-all hover:text-blue-600 mr-2"
            onClick={() => router.push("/login")}
          >
            login
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-800 transition-all"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Small Screens */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-10 left-0 w-full z-40"
        >
          <div className="flex flex-col py-4 items-center bg-white mx-5 rounded-b-3xl shadow-md">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu}>
                <motion.div
                  className={`px-6 py-2 text-md cursor-pointer w-full ${
                    pathname === link.href
                      ? "text-blue-600 font-bold"
                      : "text-slate-800"
                  }`}
                  whileHover={{ backgroundColor: "rgba(0, 0, 255, 0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
            <div className="px-6 mt-3 w-full">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-3xl w-full hover:bg-blue-700 transition-all"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
