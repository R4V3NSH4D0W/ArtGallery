"use server";

import { userOrderConfirmationEmail } from "@/lib/messages";
import prisma from "@/lib/prisma";

export async function checkoutAction(userId: string, addressId: string, email:string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cart.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        return { success: false, message: "Cart is empty" };
      }

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const order = await tx.order.create({
        data: {
          userId,
          userAddressId: addressId,
          status: "PENDING",
          totalAmount,
          createdAt: new Date(),
          updatedAt: new Date(),
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // Clear cart
      await tx.cart.deleteMany({ where: { userId } });

      // Reduce product stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      await userOrderConfirmationEmail(email, order.id);

      return { success: true, orderId: order.id };
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return { success: false, message: "Failed to process checkout" };
  }
}
