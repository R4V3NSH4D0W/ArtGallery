"use server";

import prisma from "@/lib/prisma";
import { userOrderConfirmationEmail } from "@/lib/messages";

export async function checkoutAction(userId: string, addressId: string, email: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cart.findMany({
        where: { userId },
        include: { product: { select: { price: true, quantity: true, name: true } } },
      });

      if (cartItems.length === 0) {
        return { success: false, message: "Your cart is empty" };
      }

      const stockErrors = cartItems
        .filter((item) => item.product.quantity < item.quantity)
        .map((item) => item.product.name);

      if (stockErrors.length > 0) {
        return {
          success: false,
          message: `Insufficient stock for: ${stockErrors.join(", ")}`,
        };
      }

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const order = await tx.order.create({
        data: {
          userId,
          userAddressId: addressId,
          totalAmount,
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      await Promise.all(
        cartItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          })
        )
      );

      await tx.cart.deleteMany({ where: { userId } });

      return { success: true, orderId: order.id };
    });

    if (result.success) {
      if (result.orderId) {
        userOrderConfirmationEmail(email, result.orderId).catch((err) =>
          console.error("Email sending error:", err)
        );
      }
    
    }

    return result;
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: "An error occurred while processing your order",
    };
  }
}
