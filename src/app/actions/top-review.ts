import prisma from "@/lib/prisma";

export async function getTopReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: { rating: 5 },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        product: true
      }
    });

    return reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.product.name,
      description: review.comment || '',
      reviewer: review.user.name,
      reviewerImage: '/default-avatar.jpg',
      date: new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
  } catch{
    return [];
  }
}