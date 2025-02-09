import { NextResponse } from "next/server";
import { ProductResponse } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  if (!id) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const productResponse: ProductResponse = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      category: product.category,
      images: product.images,
      createdAt: product.createdAt.toISOString(),
      status: product.status,
      dimensions: {
        length: product.length ?? 0,
        width: product.width ?? 0,
        breadth: product.breadth ?? 0,
      },
      material: product.material,
    };

    return NextResponse.json(productResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
