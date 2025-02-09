import { Button } from "@/components/ui/button";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";

function AddToCartIcon() {
  return (
    <div className="fixed bottom-4 right-4 lg:hidden z-50">
      <Button
        className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transition duration-300"
        aria-label="Add to Cart"
      >
        <FaShoppingCart className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}

export default AddToCartIcon;
