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
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
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
            create: [{
              productId,
              quantity,
              price: product.price,
            }]
          },
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });

      await userOrderConfirmationEmail(email, order.id);
      revalidatePath("/page/[id]", "page");

      return { success: true, orderId: order.id };
    });
  } catch (error) {
    console.error("Buy Now error:", error);
    return { success: false, message: "Failed to process order" };
  }
}