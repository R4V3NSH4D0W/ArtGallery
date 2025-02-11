// app/actions/auth.ts

import prisma from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "@/lib/otp";
import bcrypt from "bcryptjs";

export async function sendOtpAction(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const existingOtp = await prisma.oTP.findUnique({
    where: { email },
  });
  if (existingOtp && existingOtp.expiresAt > new Date()) {
    return { message: "OTP already sent. Please wait for it to expire.", expiresAt: existingOtp.expiresAt };
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await prisma.oTP.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    await sendOTPEmail(email, otp);

    return { message: "OTP sent to email. Please verify.", expiresAt };
  } catch {
    throw new Error("Error sending OTP");
  }
}

export async function verifyOtpAction(email: string, otp: string, password: string, name: string) {
  try {
    const otpRecord = await prisma.oTP.findUnique({ where: { email } });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    await prisma.oTP.delete({ where: { email } });

    return { message: "Account created successfully", user };
  } catch  {
    throw new Error("Error verifying OTP");
  }
}
