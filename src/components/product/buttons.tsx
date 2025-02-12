"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

interface IButtons {
  id: string;
}

function Buttons({ id }: IButtons) {
  const handelAddToCart = async () => {
    console.log(`Added product with ID ${id} to cart.`);
  };

  const handelAddToWishlist = async () => {
    console.log(`Added product with ID ${id} to wishlist.`);
  };

  return (
    <div className="hidden lg:flex flex-col sm:flex-row gap-4 mt-4">
      <Button
        onClick={handelAddToCart}
        className="flex-1 h-14 text-lg gap-3 hover:scale-[1.02] transition-transform bg-blue-500 hover:bg-blue-600"
      >
        <FaShoppingCart className="w-5 h-5" />
        Add to Cart
      </Button>
      <Button
        onClick={handelAddToWishlist}
        variant="outline"
        className="flex-1 h-14 text-lg gap-3 border-2 hover:border-primary"
      >
        <FaHeart className="w-5 h-5" />
        Wishlist
      </Button>
    </div>
  );
}

export default Buttons;
