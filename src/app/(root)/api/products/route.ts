import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import type { Prisma } from "@prisma/client";

type UserPayload = {
  id: string;
  role: "ADMIN" | "USER";
};

type ActionType = "change-status";

const validStatuses = ["active", "inactive", "archived", "draft"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function verifyAdmin(request: Request): Promise<UserPayload | null> {
  const cookies = request.headers.get("cookie");
  const token = cookies
    ?.split("; ")
    .find((cookie) => cookie.startsWith("auth_token="))
    ?.split("=")[1];

  const user = token ? (verifyJwt(token) as UserPayload | null) : null;
  return user?.role === "ADMIN" ? user : null;
}

async function handleFileUpload(files: File[]): Promise<string[]> {
  const uploadDir = join(process.cwd(), "uploads", "products");
  await mkdir(uploadDir, { recursive: true });

  const imagePaths: string[] = [];

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 5MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${uuidv4()}.${file.name.split(".").pop()}`;
    const filePath = join(uploadDir, uniqueName);

    await writeFile(filePath, buffer);
    imagePaths.push(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads?file=${uniqueName}`);
  }

  return imagePaths;
}

async function CREATE_PRODUCT(req: Request): Promise<NextResponse> {
  const formData = await req.formData();

  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Missing product name" }, { status: 400 });
  }

  const price = parseFloat(formData.get("price") as string);
  if (isNaN(price)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const categoryInput = formData.get("category");
  if (typeof categoryInput !== "string") {
    return NextResponse.json({ error: "Invalid category data" }, { status: 400 });
  }
  
  const category = JSON.parse(categoryInput) as string[];
  if (!Array.isArray(category) || category.length === 0) {
    return NextResponse.json({ error: "Invalid category format" }, { status: 400 });
  }

  const images = formData.getAll("images") as File[];
  if (images.length === 0) {
    return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
  }

  try {
    const imagePaths = await handleFileUpload(images);

    const productData: Prisma.ProductCreateInput = {
      name,
      price,
      quantity: parseInt(formData.get("quantity") as string) || 0,
      description: (formData.get("description") as string) || "",
      category: { set: category },
      material: { set: JSON.parse(formData.get("material") as string) as string[] },
      images: imagePaths,
      length: parseFloat(formData.get("length") as string) || 0,
      width: parseFloat(formData.get("width") as string) || 0,
      breadth: parseFloat(formData.get("breadth") as string) || 0,
    };

    const product = await prisma.product.create({ data: productData });
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function CHANGE_STATUS(productId: string, status: string): Promise<NextResponse> {
  if (!validStatuses.includes(status )) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { status: status  },
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error changing status:", error);
    return NextResponse.json({ error: "Failed to change product status" }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const contentType = req.headers.get("Content-Type");

    if (contentType?.includes("multipart/form-data")) {
      return await CREATE_PRODUCT(req);
    }

    if (contentType?.includes("application/json")) {
      const body = await req.json();
      const { action, productId, status } = body as { action?: ActionType; productId?: string; status?: string };

      if (action === "change-status" && productId && status) {
        return await CHANGE_STATUS(productId, status);
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const search = url.searchParams.get("q") || "";
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const status = url.searchParams.get("status") || "all";
  const category = url.searchParams.get("category") || "All";
  const limit = parseInt(url.searchParams.get("limit") || "6", 10);

  try {
    const whereCondition: Prisma.ProductWhereInput = {
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
      ...(category !== "All" && { category: { has: category } }),
    };

    const isAdmin = (await verifyAdmin(req)) !== null;
    if (!isAdmin) {
      whereCondition.status = "active";
    } else if (status !== "all") {
      whereCondition.status = status;
    }

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    const formattedProducts = products.map(({ length, width, breadth, ...rest }) => ({
      ...rest,
      ...(length && width && breadth && { dimensions: { length, width, breadth } }),
    }));

    return NextResponse.json(
      {
        success: true,
        products: formattedProducts,
        totalProducts,
        newOffset: offset + limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const productId = new URL(req.url).searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const uploadDir = join(process.cwd(), "uploads", "products");
    await Promise.all(
      product.images.map(async (imageUrl) => {
        const fileName = new URL(imageUrl).searchParams.get("file");
        if (fileName) {
          try {
            await unlink(join(uploadDir, fileName));
          } catch  {
            console.error(`Failed to delete image: ${fileName}`);
          }
        }
      })
    );

    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const productId = new URL(req.url).searchParams.get("id");
  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Handle file deletions
    const deletedImages = formData.getAll("deletedImages") as string[];
    const updatedImages = existingProduct.images.filter((imageUrl) => {
      const fileName = new URL(imageUrl).searchParams.get("file");
      return !deletedImages.some((deletedUrl) => deletedUrl.includes(fileName || ""));
    });

    // Handle new file uploads
    const newImages = formData.getAll("images") as File[];
    const newImagePaths = await handleFileUpload(newImages);

    const updateData: Prisma.ProductUpdateInput = {
      name: (formData.get("name") as string) || existingProduct.name,
      price: parseFloat(formData.get("price") as string) || existingProduct.price,
      quantity: parseInt(formData.get("quantity") as string) || existingProduct.quantity,
      description: (formData.get("description") as string) || existingProduct.description,
      category: { set: JSON.parse(formData.get("category") as string) || existingProduct.category },
      material: { set: JSON.parse(formData.get("material") as string) || existingProduct.material },
      images: [...updatedImages, ...newImagePaths],
      length: parseFloat(formData.get("length") as string) || existingProduct.length,
      width: parseFloat(formData.get("width") as string) || existingProduct.width,
      breadth: parseFloat(formData.get("breadth") as string) || existingProduct.breadth,
    };

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}