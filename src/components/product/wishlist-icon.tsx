import React from "react";
import { FaHeart } from "react-icons/fa";

function WishListIcon() {
  return (
    <button
      className="block lg:hidden p-2 rounded-full bg-accent/20 shadow-lg"
      aria-label="Wishlist"
    >
      <FaHeart className="w-6 h-6 text-primary" />
    </button>
  );
}

export default WishListIcon;
