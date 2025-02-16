'use server';

import prisma from "@/lib/prisma";

export async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    return { success: true, product };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { success: false, message: 'Failed to fetch product' };
  }
}
