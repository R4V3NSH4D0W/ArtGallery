// app/actions/checkout.ts
"use server";

import { userOrderConfirmationEmail } from "@/lib/messages";
import prisma from "@/lib/prisma";

export async function checkoutAction(userId: string, addressId: string, email: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cart.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        return { success: false, message: "Your cart is empty" };
      }

      // Stock validation
      const stockErrors = [];
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { quantity: true },
        });

        if (!product || product.quantity < item.quantity) {
          stockErrors.push(item.product.name);
        }
      }

      if (stockErrors.length > 0) {
        return {
          success: false,
          message: `Insufficient stock for: ${stockErrors.join(", ")}`
        };
      }

      // Calculate total
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
      );

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          userAddressId: addressId,
          totalAmount,
          orderItems: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // Update stock
      await Promise.all(
        cartItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          })
        )
      );

      // Clear cart
      await tx.cart.deleteMany({ where: { userId } });

      // Send email
      await userOrderConfirmationEmail(email, order.id);

      return { success: true, orderId: order.id };
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: "An error occurred while processing your order"
    };
  }
}