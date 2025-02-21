import prisma from "@/lib/prisma";

export async function getArtDimensions() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        OR: [
          { length: { not: null } },
          { width: { not: null } },
          { breadth: { not: null } }
        ]
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return products.map(product => ({
      id: product.id,
      image: product.images[0],
      title: product.name,
      size: [product.length, product.width, product.breadth]
        .filter(Boolean)
        .join('x') + ' cm',
      material: product.material.join(', '),
      price: `NRS ${product.price.toFixed(2)}`
    }));
  } catch  {
    return [];
  }
}