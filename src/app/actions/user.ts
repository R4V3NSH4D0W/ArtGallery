'use server';

import prisma from '@/lib/prisma';
import { Profile } from '@/lib/types';

export const getUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { address: true }
  });
};

export const updateUserProfile = async (userId: string, data: Profile) => {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { name: data.name }
    });

    if (data.address) {
      await tx.userAddress.upsert({
        where: { userId },
        update: {
          phoneNumber: data.phoneNumber,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode
        },
        create: {
          userId,
          phoneNumber: data.phoneNumber,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode
        }
      });
    }
  });
};