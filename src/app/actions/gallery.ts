'use server';

import { writeFile, mkdir, unlink } from 'fs/promises';
import path, { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ActionResult, GalleryArt } from '@/lib/types';


const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function handleGalleryUpload(files: File[]): Promise<string[]> {
  try {

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 5 * 1024 * 1024) {
      throw new Error('Total payload size exceeds 5MB');
    }

    const uploadDir = join(process.cwd(), 'uploads', 'gallery');
    await mkdir(uploadDir, { recursive: true });

    return Promise.all(
      files.map(async (file) => {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}`);
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.name} exceeds 5MB`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueName = `${uuidv4()}${path.extname(file.name)}`;
        const filePath = join(uploadDir, uniqueName);
        
        await writeFile(filePath, buffer);
        return `${process.env.NEXT_PUBLIC_API_URL}/api/gallery?file=${uniqueName}`;
      })
    );
  } catch  {
    throw new Error(`Upload failed`);
  }
}
export async function createGalleryEntry(
  prevState: ActionResult<GalleryArt> | null,
  formData: FormData
): Promise<ActionResult<GalleryArt>> {
  try {
    const files = formData.getAll('images') as File[];
    if (files.length === 0) {
      return { success: false, error: 'No images selected' };
    }

    const imagePaths = await handleGalleryUpload(files);
    const newArt = await prisma.galleryArt.create({
      data: { images: imagePaths }
    });

    revalidatePath('/gallery');
    return { success: true, data: newArt };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return { success: false, error: message };
  }
}

export async function getGalleryArts(): Promise<GalleryArt[]> {
  return prisma.galleryArt.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function deleteGalleryArt(
  artId: string, 
  imagePath: string
): Promise<ActionResult> {
  try {
    const url = new URL(imagePath);
    const fileName = url.searchParams.get('file');
    
    if (!fileName) {
      return { success: false, error: 'Invalid image URL' };
    }

    const filePath = join(
      process.cwd(), 
      'uploads', 
      'gallery', 
      fileName
    );
    
    await unlink(filePath);

    await prisma.galleryArt.delete({
      where: { id: artId }
    });

    revalidatePath('/gallery');
    revalidatePath('/dashboard/gallery');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    console.error('Delete error:', message);
    return { success: false, error: message };
  }
}