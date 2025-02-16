"use server";


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
  return prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!currentOrder) {
      throw new Error("Order not found");
    }

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

    revalidatePath("/dashboard/order");
    return updatedOrder;
  });
}