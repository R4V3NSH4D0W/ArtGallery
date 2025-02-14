"use client";
import { addToCart } from "@/app/actions/add-to-cart";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2";
import { toast } from "react-toastify";

interface IButtons {
  id: string;
  stockQuantity: number;
}

function Buttons({ id, stockQuantity }: IButtons) {
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuthContext();

  const handleIncrement = () => {
    if (quantity < stockQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };
  const handelAddToCart = async () => {
    try {
      if (user) {
        await addToCart(user.id, id, quantity);
        toast.success("Added to Cart");
      } else {
        toast.error("Login in Required");
      }
    } catch (error) {
      toast.error(`Error adding to cart: ${(error as Error).message}`);
    }
  };

  const handelAddToWishlist = async () => {
    console.log(`Added product with ID ${id} to wishlist.`);
  };

  return (
    <div className=" flex flex-col gap-4 ">
      <div className="flex flex-row gap-4 items-center">
        <label className="text-gray-600">Quantity</label>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDecrement}
            disabled={quantity === 1}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            <FaMinus />
          </button>
          <span className="text-gray-600">{quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= stockQuantity}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-center mt-2">
        <Button
          onClick={handelAddToCart}
          className="flex-1 h-[3rem] lg:h-14 lg:text-lg gap-3 hover:scale-[1.02] transition-transfor bg-black"
        >
          <FaShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
        <Button
          onClick={handelAddToWishlist}
          className="flex-1 h-[3rem] lg:h-14 lg:text-lg gap-3 hover:scale-[1.02]  bg-blue-600 hover:bg-blue-800"
        >
          <HiShoppingBag className="w-5 h-5" />
          Buy Now
        </Button>
      </div>
    </div>
  );
}

export default Buttons;
