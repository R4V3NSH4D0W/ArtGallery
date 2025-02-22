"use server";

import prisma from "@/lib/prisma";


export async function getUserAddress(userId: string) {
  try {
    const address = await prisma.userAddress.findUnique({
      where: { userId },
    });
    return address;
  } catch (error) {
    console.error("Error fetching user address:", error);
    return null;
  }
}

export async function createUserAddress(
  userId: string,
  phoneNumber: string,
  address: string,
  city: string,
  postalCode: string
) {
  try {
   
    const existingAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    if (existingAddress) {
      const updatedAddress = await prisma.userAddress.update({
        where: { userId },
        data: {
          phoneNumber,
          address,
          city,
          postalCode,
        },
      });
      return { success: true, addressId: updatedAddress.id };
    } else {
      const newAddress = await prisma.userAddress.create({
        data: {
          userId,
          phoneNumber,
          address,
          city,
          postalCode,
        },
      });
      return { success: true, addressId: newAddress.id };
    }
  } catch (error) {
    console.error("Error creating or updating user address:", error);
    return { success: false };
  }
}

export async function updateUserAddress(
  userId: string,
  phoneNumber: string,
  address: string,
  city: string,
  postalCode: string
) {
  try {
    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: {
        phoneNumber,
        address,
        city,
        postalCode,
      },
    });
    return { success: true, addressId: updatedAddress.id };
  } catch (error) {
    console.error("Error updating user address:", error);
    return { success: false };
  }
}
