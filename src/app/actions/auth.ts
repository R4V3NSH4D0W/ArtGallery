"use server";
import prisma from "@/lib/prisma";
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from "@/lib/otp";
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
    return { message: "OTP already sent", expiresAt: existingOtp.expiresAt };
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
    console.log(otpRecord);

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
    
    await sendWelcomeEmail(email, name);


    return { message: "Account created successfully", user };
  } catch (error) {
    console.error("Error verifying OTP:", error);

    throw new Error("Error verifying OTP");
  }
}

export const forgotPassword = async (email: string) => {
  if (!email) return { error: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "User not found" };

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  await prisma.oTP.upsert({
    where: { email },
    update: { otp, expiresAt },
    create: { email, otp, expiresAt },
  });

  await sendOTPEmail(email, otp);

  return { success: "OTP sent to your email",expiresAt };
};

export const resetPassword = async (email: string, password: string) => {
  if (!email || !password) return { error: "Missing email or password" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "User not found" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  return { success: "Password has been reset successfully" };
};


export const verifyOtp = async (email: string, otp: string) => {
  if (!email || !otp) return { error: "Email and OTP are required" };

  const otpRecord = await prisma.oTP.findUnique({ where: { email } });
  if (!otpRecord) return { error: "OTP not found" };

  if (otpRecord.otp !== otp) return { error: "Invalid OTP" };

  if (otpRecord.expiresAt < new Date()) return { error: "OTP expired" };

  await prisma.oTP.delete({ where: { email } });

  return { success: "OTP verified, proceed to reset password" };
};