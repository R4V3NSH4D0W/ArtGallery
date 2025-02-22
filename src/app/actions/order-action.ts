"use server";


import { sendOrderStatusEmail } from "@/lib/messages";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      userAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              category: true,
              material: true,
              length: true,
              width: true,
              breadth: true,
              images: true,
              createdAt: true,
              updatedAt: true,
              status: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
}



export async function updateOrderStatus(id: string, status: OrderStatus) {
  const result = await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id },
      include: { 
        orderItems: true,
        user: { select: { email: true } }, 
      },
    });

    if (!currentOrder) throw new Error("Order not found");

    const updatedOrder = await tx.order.update({
      where: { id },
      data: { status },
    });

    if (status === "CANCELLED" && currentOrder.status !== "CANCELLED") {
      for (const item of currentOrder.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }
    } else if (currentOrder.status === "CANCELLED" && status !== "CANCELLED") {
      for (const item of currentOrder.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
    }

    return { currentOrder, updatedOrder };
  });

  try {
     sendOrderStatusEmail(
      result.currentOrder.user.email, 
      id,
      status
    );
  } catch (error) {
    console.error("Email failed to send:", error);
  }

  revalidatePath("/dashboard/order");
  revalidatePath('/dashboard/analytics');

  return result.updatedOrder;
}