import nodemailer from "nodemailer";
import { randomInt } from "crypto";

export function generateOTP() {
  const otp = randomInt(100000, 999999).toString();
  return otp;
}

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Your One-Time Password (OTP) to Access Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #4CAF50;">Hello!</h2>
          <p style="font-size: 16px;">You've requested a One-Time Password (OTP) to verify your identity.</p>
          
          <p style="font-size: 18px; font-weight: bold; color: #333;">🚀 <span style="color: #4CAF50;">Your OTP Code:</span> <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</span></p>
          
          <p style="font-size: 16px; color: #333;">This code will expire in <strong>5 minutes</strong> for your security.</p>
          
          <p style="font-size: 16px; color: #333;">Please enter the code in the provided field to complete your verification.</p>
          
          <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>

          <footer style="margin-top: 20px; font-size: 12px; color: #888;">
            <p>[CoreWeave]</p>
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch  {
    throw new Error("Failed to send OTP email");
  }
}

