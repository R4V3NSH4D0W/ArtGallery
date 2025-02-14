"use server";
import prisma from "@/lib/prisma";

export const getOrders = async (userId: string) => {
    return prisma.order.findMany({
      where: { userId },
      include: {
        userAddress: true,
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  };