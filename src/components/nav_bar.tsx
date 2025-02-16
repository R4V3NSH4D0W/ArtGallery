import React, { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getColorByFirstLetter, getFirstLetter } from "@/lib/helper";
import { useLogout } from "@/app/hooks/useLogout";
import { useAuthContext } from "@/context/AuthContext";
import { FaArrowRight } from "react-icons/fa";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isUser, refetchUser, user } = useAuthContext();
  const { logout } = useLogout();

  const closeMenu = () => setMenuOpen(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    refetchUser();
    router.push("/signin");
  };

  const handleJoinUs = () => {
    closeMenu();
    router.push("/signin");
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
        <button
          className="relative h-6 w-6 lg:h-10 lg:w-10"
          onClick={() => router.push("/")}
        >
          <Image src="/logo.png" alt="logo" fill />
        </button>

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

        {/* Desktop User Profile */}
        <div className="hidden md:flex items-center">
          {isUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white font-semibold text-lg"
                style={{
                  backgroundColor: getColorByFirstLetter(
                    getFirstLetter(user?.name || "")
                  ),
                }}
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
            <button
              className="flex flex-row items-center gap-2 hover:text-blue-600 hover:scale-105 transition-all"
              onClick={() => handleJoinUs()}
            >
              Join Us <FaArrowRight />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-800 focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed left-0 top-0 h-screen w-[18rem] bg-white z-50 shadow-xl"
          >
            <div className="p-4">
              <button
                onClick={closeMenu}
                className="text-gray-600 hover:text-gray-800 mb-4"
              >
                <X size={24} />
              </button>
              {/* Profile Section */}
              {isUser && (
                <Link href="/profile" onClick={closeMenu}>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-xl"
                      style={{
                        backgroundColor: getColorByFirstLetter(
                          getFirstLetter(user?.name || "")
                        ),
                      }}
                    >
                      {getFirstLetter(user?.name || "")}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </Link>
              )}
              {/* Navigation Links */}
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`text-md ${
                      pathname === link.href
                        ? "text-blue-600 font-bold"
                        : "text-gray-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* User Actions */}
              <div className="mt-8 border-t pt-4">
                {isUser ? (
                  <>
                    <Link
                      href="/cart"
                      onClick={closeMenu}
                      className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600"
                    >
                      <ShoppingCart size={18} />
                      Cart
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 py-2 text-red-500 hover:text-red-700 w-full"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleJoinUs}
                    className="flex items-center gap-2 py-2 text-blue-600 hover:text-blue-700"
                  >
                    Join Us <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
