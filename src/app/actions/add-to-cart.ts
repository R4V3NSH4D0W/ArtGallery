"use server";
import prisma from "@/lib/prisma";
export async function addToCart(userId: string, productId: string, quantity: number) {
  try {
    const cartItem = await prisma.cart.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
    });
    return cartItem;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Unable to add to cart");
  }
}
