
"use server";

import prisma from "@/lib/prisma";

export async function getCartItems(userId: string) {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: true, 
      },
    });
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Unable to fetch cart items");
  }
}

export async function removeFromCart(userId: string, productId: string) {
  try {
    await prisma.cart.delete({
      where: { userId_productId: { userId, productId } },
    });
    console.log("Item removed from cart");
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Unable to remove item from cart");
  }
}
