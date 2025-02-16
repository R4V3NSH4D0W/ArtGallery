"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getCartItems, removeFromCart } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";
import { ProductResponse } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

function Cart() {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const items = await getCartItems(user.id);
          setCartItems(items);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCartItems();
    }
  }, [user]);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      if (user) {
        await removeFromCart(user.id, productId);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product.id !== productId)
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-[5rem]">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <FaShoppingBag className="text-primary" />
        Your Shopping Cart
      </h2>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[160px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          ))}
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <FaShoppingBag className="text-6xl text-gray-300" />
          <p className="text-xl text-gray-500">Your cart is empty</p>
          <Link href="/" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 col-span-2">
                  <div className="relative w-[18rem] lg:w-[8rem] h-20 rounded-md overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.product.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="space-y-1 text-right">
                    <p className="font-medium text-md lg:text-lg">
                      NPR{" "}
                      {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Qty:</span>
                      <span className="px-2 py-1 border rounded">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <FaTrashAlt className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl sticky bottom-4 border shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="lg:text-xl text-lg font-bold">
                Total: NPR {calculateTotalPrice().toLocaleString()}
              </div>
              <Button
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 px-8 py-6 lg:text-lg text-md bg-blue-500 hover:bg-blue-700"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
