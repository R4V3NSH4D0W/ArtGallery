"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type OrderWithRelations = Awaited<ReturnType<typeof getOrders>>[number];

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      user: true,
      userAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              description: true,
              images: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
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