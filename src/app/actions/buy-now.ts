"use server";

import { userOrderConfirmationEmail } from "@/lib/messages";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function buyNowAction(
  userId: string,
  productId: string,
  quantity: number,
  addressId: string,
  email: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { price: true, quantity: true },
      });

      if (!product) {
        return { success: false, message: "Product not found" };
      }

      if (product.quantity < quantity) {
        return { success: false, message: "Insufficient stock" };
      }

      const order = await tx.order.create({
        data: {
          userId,
          userAddressId: addressId,
          status: "PENDING",
          totalAmount: product.price * quantity,
          orderItems: {
            create: {
              productId,
              quantity,
              price: product.price,
            },
          },
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });

      return { success: true, orderId: order.id };
    });

    if (result.success) {
      if (result.orderId) {
        userOrderConfirmationEmail(email, result.orderId).catch((err) =>
          console.error("Email sending error:", err)
        );
      }
      console.error("Email sending error:")
    }

    revalidatePath("/dashboard/order");

    return result;
  } catch (error) {
    console.error("Buy Now error:", error);
    return { success: false, message: "Failed to process order" };
  }
}
