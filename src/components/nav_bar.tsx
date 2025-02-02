import React, { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getFirstLetter, getRandomLightColor } from "@/lib/helper";
import Cookies from "js-cookie";
import { useUser } from "@/context/userContext";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUser, refetchUser } = useUser();

  const closeMenu = () => setMenuOpen(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const handleLogout = () => {
    Cookies.remove("token");
    refetchUser();
    closeMenu();
    router.push("/login");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Gallery" },
    { href: "/shop", label: "Shop" },
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
                className={`text-md cursor-pointer ${
                  pathname === link.href
                    ? "text-blue-600 font-bold"
                    : "text-slate-800"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {link.label}
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

        {/* Desktop User Profile (shown only on md and larger) */}
        <div className="hidden md:flex items-center">
          {isUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white font-semibold text-lg"
                style={{ backgroundColor: getRandomLightColor() }}
              >
                {getFirstLetter(user?.name || "")}
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={closeDropdown}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={closeDropdown}
                  >
                    <ShoppingCart size={18} />
                    Cart
                  </Link>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <button
                className="px-4 py-2 rounded-3xl transition-all hover:text-blue-600"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-800 transition-all"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          // Position the mobile menu just below the nav bar using top-full and a margin-top
          className="absolute top-full left-0 w-full z-40 "
        >
          <div className="flex flex-col py-4 items-center bg-white mx-5 rounded-3xl shadow-md">
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

            {/* Mobile User Actions (no user icon here) */}
            <div className="px-6 mt-3 w-full flex flex-col items-center">
              {isUser ? (
                <>
                  <Link
                    href="/profile"
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 w-full text-center"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/cart"
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 w-full text-center"
                    onClick={closeMenu}
                  >
                    Cart
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 text-red-500 hover:bg-gray-100 w-full text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-700 transition-all"
                    onClick={() => {
                      router.push("/login");
                      closeMenu();
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
