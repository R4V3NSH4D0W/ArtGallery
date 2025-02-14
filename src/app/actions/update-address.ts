import prisma from "@/lib/prisma";

export const updateAddress = async (userId: string, addressData: {
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
}) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        address: {
          update: {
            address: addressData.address,
            city: addressData.city,
            postalCode: addressData.postalCode,
            phoneNumber: addressData.phoneNumber,
          },
        },
      },
    });

    return { success: true, message: "Address updated successfully." };
  } catch (error) {
    return { success: false, message: (error instanceof Error) ? error.message : "An unknown error occurred" };
  }
};
