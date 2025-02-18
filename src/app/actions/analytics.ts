'use server'

import prisma from '@/lib/prisma'
import { getAcronym, getCurrentMonthStart, getLastMonthStart } from '@/lib/utils';

function getPercentageChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function getTotalUsers() {
  const [current, previous] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: getCurrentMonthStart() }} }),
    prisma.user.count({ where: { createdAt: { gte: getLastMonthStart(), lt: getCurrentMonthStart() }} })
  ]);
  return { count: current, change: getPercentageChange(current, previous) };
}

export async function getTotalProducts() {
  const [current, previous] = await Promise.all([
    prisma.product.count({ where: { createdAt: { gte: getCurrentMonthStart() } }}),
    prisma.product.count({ where: { createdAt: { gte: getLastMonthStart(), lt: getCurrentMonthStart() } }})
  ]);
  return { count: current, change: getPercentageChange(current, previous) };
}

export async function getTotalOrders() {
  const [current, previous] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: getCurrentMonthStart() } }}),
    prisma.order.count({ where: { createdAt: { gte: getLastMonthStart(), lt: getCurrentMonthStart() }} })
  ]);
  return { count: current, change: getPercentageChange(current, previous) };
}

export async function getTotalRevenue() {
  const [current, previous] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'DELIVERED', createdAt: { gte: getCurrentMonthStart() } }
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'DELIVERED', createdAt: { gte: getLastMonthStart(), lt: getCurrentMonthStart() } }
    })
  ]);
  
  return {
    amount: current._sum.totalAmount || 0,
    change: getPercentageChange(current._sum.totalAmount || 0, previous._sum.totalAmount || 0)
  };
}

export async function getRecentOrders() {
  return prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      orderItems: { include: { product: true } }
    }
  });
}

export async function getSalesData() {
  const data = await prisma.order.groupBy({
    by: ['createdAt'],
    _sum: { totalAmount: true },
    where: { status: 'DELIVERED' },
    orderBy: { createdAt: 'asc' }
  });

  return data.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    }),
    sales: item._sum.totalAmount || 0
  }));
}

export async function getProductPerformance() {
  const products = await prisma.product.findMany({
    take: 5,
    include: {
      OrderItem: {
        where: { order: { status: "DELIVERED" } }, 
        select: { quantity: true, price: true },
      },
    },
  });

  return products.map((product) => ({
    short_name: getAcronym(product.name),
    name: product.name,
    sales: product.OrderItem.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    price: product.price,
  }));
}
