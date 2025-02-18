"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  userId: string;
  comment: string;
  rating: number;
  productId: string;
}) {
 
  try {
    await prisma.review.create({
      data: {
        comment: data.comment,
        rating: data.rating,
        productId: data.productId,
        userId: data.userId
      }
    });
    revalidatePath(`/detail/${data.productId}`);
    return { success: "Review created successfully" };
  } catch  {
   
    return { error: "Failed to create review" };
  }
}

export async function createComment(data: {
  userId: string;
  content: string;
  reviewId: string;
  parentId?: string;
}) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: data.reviewId },
      select: { productId: true }
    });

    if (!review) return { error: "Review not found" };

    await prisma.comment.create({
      data: {
        content: data.content,
        reviewId: data.reviewId,
        parentId: data.parentId,
        userId: data.userId
      }
    });

    revalidatePath(`/detail/${review.productId}`);
    return { success: "Comment created successfully" };
  } catch {
    return { error: "Failed to create comment" };
  }
}

export async function deleteReview(reviewId: string, userId: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId, userId },
      include: { comments: true }
    });

    if (!review) return { error: "Review not found" };

    // Delete all comments first
    await prisma.comment.deleteMany({
      where: { reviewId: review.id }
    });

    // Then delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    revalidatePath(`/detail/${review.productId}`);
    return { success: "Review deleted successfully" };
  } catch  {
    return { error: "Failed to delete review" };
  }
}

export async function updateComment(data: {
  commentId: string;
  content: string;
  userId: string;
}) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: data.commentId },
      include: { review: true }
    });

    if (!comment) return { error: "Comment not found" };

    await prisma.comment.update({
      where: { id: data.commentId, userId: data.userId },
      data: { content: data.content }
    });

    revalidatePath(`/detail/${comment.review.productId}`);
    return { success: "Comment updated successfully" };
  } catch {
    return { error: "Failed to update comment" };
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { review: true }
    });

    if (!comment) return { error: "Comment not found" };

    await prisma.comment.delete({
      where: { id: commentId, userId }
    });

    revalidatePath(`/detail/${comment.review.productId}`);
    return { success: "Comment deleted successfully" };
  } catch  {
    return { error: "Failed to delete comment" };
  }
}