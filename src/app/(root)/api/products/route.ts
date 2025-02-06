import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { unlink } from "fs/promises";


import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import fs from "fs";



export async function POST(req: Request) {
   
    const cookies = req.headers.get("cookie");
    const token = cookies
      ?.split("; ")
      .find((cookie) => cookie.startsWith("auth_token="))
      ?.split("=")[1];
  
    const user = token ? verifyJwt(token) : null;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      const contentType = req.headers.get("Content-Type");
  
      if (contentType?.includes("multipart/form-data")) {
        return await CREATE_PRODUCT(req);
      } else if (contentType?.includes("application/json")) {
        const body = await req.json();
        const { action, productId, status } = body;
  
        if (action === "change-status") {
          return await CHANGE_STATUS(productId, status);
        }
        if(action ==="get-product"){
          return await GET_PRODUCT(productId);

        }
      }
  
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  async function GET_PRODUCT(productId: string) {
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }
    
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, product }, { status: 200 });
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  

  async function CREATE_PRODUCT(req: Request) {
    const formData = await req.formData();
  
    // Extract form data fields
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const description = formData.get("description") as string;
    const category = JSON.parse(formData.get("category") as string) as string[];  // Parsing category from JSON string
    const material = JSON.parse(formData.get("material") as string) as string[];  // Parsing material from JSON string
    const length = parseFloat(formData.get("length") as string);
    const width = parseFloat(formData.get("width") as string);
    const breadth = parseFloat(formData.get("breadth") as string);
    const images = formData.getAll("images") as File[];
  
    // Validation
    if (!name || !price || !category.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
  
    const imagePaths: string[] = [];
    for (const image of images) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB
  
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }
  
      if (image.size > maxSize) {
        return NextResponse.json({ error: "File size exceeds 5MB" }, { status: 400 });
      }
  
      const buffer = Buffer.from(await image.arrayBuffer());
      const uniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
      const filePath = join(uploadDir, uniqueName);
  
      await writeFile(filePath, buffer);
      imagePaths.push(`/uploads/${uniqueName}`);
    }
  
    try {
      // Create product record in the database
      const product = await prisma.product.create({
        data: {
          name,
          price,
          quantity,
          description,
          category: { set: category }, 
          images: imagePaths,
          material: { set: material }, 
          length,
          width,
          breadth,
        },
      });
  
      return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error) {
      console.error("Error creating product:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  
  
  async function CHANGE_STATUS(productId: number, status: string) {
    const validStatuses = ["active", "inactive", "archived", "draft"];
  

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }
  
    try {

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
  

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { status },
      });
  
      return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
    } catch (error) {
      console.error("Error changing status:", error);
      return NextResponse.json({ error: "Failed to change product status" }, { status: 500 });
    }
  }


  

 

  export async function GET(req: Request) {
    const url = new URL(req.url);
  
    const search = url.searchParams.get("q") || "";
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    const status = url.searchParams.get("status") || "all";
    const category = url.searchParams.get("category") || "All";
    const limit = parseInt(url.searchParams.get("limit") || "6", 10);
  
    const cookies = req.headers.get("cookie");
    const token = cookies
      ?.split("; ")
      .find((cookie) => cookie.startsWith("auth_token="))
      ?.split("=")[1];
  
    const user = token ? verifyJwt(token) : null;
  
    try {
      const whereCondition: Prisma.ProductWhereInput = {
        ...(search && {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(category !== "All" && {
          category: {
            has: category, // Use `has` for array filtering
          },
        }),
      };
  
      // Enforce "active" status for non-admin users
      if (!user || user.role === "USER") {
        whereCondition.status = "active";
      }
  
      // Allow admins to filter by status
      if (user?.role === "ADMIN" && status !== "all") {
        whereCondition.status = status;
      }
  
      const products = await prisma.product.findMany({
        where: whereCondition,
        skip: offset,
        take: limit, // Use `limit` from the query string
      });
  
      const totalProducts = await prisma.product.count({ where: whereCondition });
  
      // Format the response by adding `dimensions` field as an object
      const formattedProducts = products.map(product => {
        const { length, width, breadth, ...rest } = product;
        return {
          ...rest,
          dimensions: length && width && breadth
            ? { length, width, breadth }
            : undefined,  // Include dimensions as an object only if all fields exist
        };
      });
  
      // Calculate the next offset value for pagination
      const newOffset = offset + limit;
  
      return NextResponse.json(
        { success: true, products: formattedProducts, totalProducts, newOffset },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }
  }
  

export async function DELETE(req: Request) {
  
    const cookies = req.headers.get("cookie");
    const token = cookies
      ?.split("; ")
      .find((cookie) => cookie.startsWith("auth_token="))
      ?.split("=")[1];
    
    const user = token ? verifyJwt(token) : null;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
  
      const url = new URL(req.url);
      const productId = parseInt(url.searchParams.get("productId") || "0", 10); 
    
  
      if (!productId) {
        return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
      }
  

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const uploadDir = join(process.cwd(), "public", "uploads");
      for (const imagePath of product.images) {
        const filePath = join(uploadDir, imagePath.split("/uploads/")[1]); 
        try {
          await unlink(filePath);
        } catch (error) {
          console.error(`Failed to delete image: ${filePath}`, error);
        }
      }
  

      await prisma.product.delete({
        where: { id: productId },
      });
  
      return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  
    } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  export async function PUT(req: Request) {
    const url = new URL(req.url);
    const cookies = req.headers.get("cookie");
    const token = cookies
      ?.split("; ")
      .find((cookie) => cookie.startsWith("auth_token="))
      ?.split("=")[1];
  
    const user = token ? verifyJwt(token) : null;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    const productId = parseInt(url.searchParams.get("id") as string, 10);
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
  
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const description = formData.get("description") as string;
    const category = JSON.parse(formData.get("category") as string) as string[];  // Ensure category is parsed as an array
    const material = JSON.parse(formData.get("material") as string) as string[];  // Ensure material is parsed as an array
    const images = formData.getAll("images") as File[];
    const deletedImages = formData.getAll("deletedImages") as string[];
  
    const length = parseFloat(formData.get("length") as string);  // Get length from formData
    const width = parseFloat(formData.get("width") as string);    // Get width from formData
    const breadth = parseFloat(formData.get("breadth") as string); // Get breadth from formData
  
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
  
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
  
    const imagePaths: string[] = [...existingProduct.images];
  
    if (images.length > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/pjpeg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
  
      for (const image of images) {
        if (!allowedTypes.includes(image.type)) {
          return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }
  
        if (image.size > maxSize) {
          return NextResponse.json({ error: "File size exceeds 5MB" }, { status: 400 });
        }
  
        const fileExtension = image.name.split(".").pop()?.toLowerCase();
        const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
        if (!allowedExtensions.includes(fileExtension || "")) {
          return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
        }
  
        const buffer = Buffer.from(await image.arrayBuffer());
        const uniqueName = `${uuidv4()}.${fileExtension}`;
        const filePath = join(uploadDir, uniqueName);
  
        await writeFile(filePath, buffer);
        imagePaths.push(`/uploads/${uniqueName}`);
      }
    }
  
    if (deletedImages.length > 0) {
      for (const deletedImage of deletedImages) {
        const filePath = join(process.cwd(), "public", deletedImage);
        try {
          await removeImage(filePath);
        } catch (error) {
          console.error(`Error deleting image ${deletedImage}:`, error);
        }
  
        const index = imagePaths.indexOf(deletedImage);
        if (index !== -1) {
          imagePaths.splice(index, 1);
        }
      }
    }
  
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || existingProduct.name,
        price: price || existingProduct.price,
        quantity: quantity || existingProduct.quantity,
        description: description || existingProduct.description,
        category: { set: category.length > 0 ? category : existingProduct.category }, // Update category
        material: { set: material.length > 0 ? material : existingProduct.material }, // Update material
        images: imagePaths,
        length: length || existingProduct.length,   // Update length
        width: width || existingProduct.width,      // Update width
        breadth: breadth || existingProduct.breadth, // Update breadth
      },
    });
  
    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  }
  
  async function removeImage(filePath: string) {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete image at ${filePath}:`, error);
    }
  }
  
