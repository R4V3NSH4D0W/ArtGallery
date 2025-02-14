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
      subject: "🎨 Your ArtGallery Access Code | CoreWeave Authentication",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background: #f8f9fa; max-width: 600px; margin: 0 auto;">
          <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 4px solid #2a2a2a;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #2a2a2a; font-size: 24px; margin: 0;">
                <span style="color: #6C63FF;">Core</span><span style="color: #2a2a2a;">Weave</span>
                <span style="font-weight: 300; color: #666; font-size: 20px;">ArtGallery</span>
              </h1>
            </div>

            <div style="border-left: 4px solid #6C63FF; padding-left: 20px; margin-bottom: 30px;">
              <h2 style="color: #2a2a2a; margin: 0 0 15px 0; font-size: 20px;">🖼️ Your Curated Access Code</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0;">
                To view our exclusive collection, please use this verification code:
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px dashed #6C63FF;">
                <div style="font-size: 32px; letter-spacing: 3px; color: #2a2a2a; font-weight: bold;">
                  ${otp}
                </div>
                <div style="color: #888; font-size: 14px; margin-top: 10px;">
                  Valid for 5 minutes
                </div>
              </div>

              <p style="color: #666; line-height: 1.6; margin: 0;">
                This code grants access to your CoreWeave ArtGallery account. 
                For security reasons, please do not share this code with anyone.
              </p>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <p style="color: #888; font-size: 12px; line-height: 1.5; margin: 0;">
                Sent with ❤️ from CoreWeave ArtGallery<br>
                Need help? <a href="mailto:support@coreweave.com" style="color: #6C63FF; text-decoration: none;">Contact our curators</a><br>
                <span style="color: #aaa;">© ${new Date().getFullYear()} CoreWeave. All rights reserved.</span>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch {
    throw new Error("Failed to send OTP email");
  }
}

export async function sendWelcomeEmail(email: string, username: string) {
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
      subject: "🎉 Welcome to ArtGallery! Your Creative Journey Begins",
      html: `
        <div style="font-family: 'Arial', sans-serif; padding: 30px; background: #f8f9fa; max-width: 600px; margin: auto;">
          <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 4px solid #6C63FF;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2a2a2a; font-size: 24px; margin: 0;">Welcome to <span style="color: #6C63FF;">ArtGallery</span>!</h1>
              <p style="color: #666; font-size: 16px;">We're excited to have you, <strong>${username}</strong>! 🎨</p>
            </div>

            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              ArtGallery is your creative hub for discovering, collecting, and showcasing beautiful artworks.  
              Start exploring now and bring your artistic vision to life!
            </p>

            <div style="text-align: center; margin-top: 20px;">
              <a href="https://artgallery.lenishmagar.me" style="display: inline-block; background: #6C63FF; color: #ffffff; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 5px;">Explore Now</a>
            </div>

            <p style="color: #888; font-size: 14px; margin-top: 20px;">
              If you have any questions, feel free to reach out. Happy creating!
            </p>

            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <p style="color: #888; font-size: 12px;">
                Sent with ❤️ from ArtGallery<br>
                Need help? <a href="mailto:support@artgallery.com" style="color: #6C63FF; text-decoration: none;">Contact Us</a><br>
                <span style="color: #aaa;">© ${new Date().getFullYear()} ArtGallery. All rights reserved.</span>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
}

