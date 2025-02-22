import nodemailer from "nodemailer";

export async function userOrderConfirmationEmail(email: string, orderId: string) {
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
      subject: "📦 Your Order is Confirmed",
      html: `
      <div style="font-family: 'Arial', sans-serif; padding: 30px; background: #f8f9fa; max-width: 600px; margin: auto;">
        <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 4px solid #6C63FF;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2a2a2a; font-size: 24px; margin: 0;">Your Order has been Confirmed! 🎉</h1>
          </div>

          <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
            Thank you for your purchase! Your order #${orderId.slice(0, 8)} has been successfully placed and is now being processed.
          </p>

          <div style="text-align: center;">
            <a href="https://artgallery.lenishmagar.me/profile" style="display: inline-block; background: #6C63FF; color: #ffffff; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 5px;">View Your Order</a>
          </div>

          <p style="color: #888; font-size: 14px; margin-top: 20px;">
            If you have any questions, feel free to reach out to us. Happy shopping!
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

export async function sendOrderStatusEmail(email: string, orderId: string, status: 'PENDING' | 'NOTICED' | 'WORKING' | 'READYTOSHIP' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const statusMessages = {
      PENDING: "Your order has been received and is pending confirmation.",
      NOTICED: "Your order has been noticed and will be processed soon.",
      WORKING: "We are currently preparing your order.",
      READYTOSHIP: "Your order is ready to be shipped.",
      SHIPPED: "Your order has been shipped and is on its way!", 
      DELIVERED: "Your order has been delivered. Enjoy your purchase!",
      CANCELLED: "Your order has been cancelled. If this is a mistake, please contact us."
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `📦 Order #${orderId.slice(0, 8)} Status Update: ${status}`,
      html: `
      <div style="font-family: 'Arial', sans-serif; padding: 30px; background: #f8f9fa; max-width: 600px; margin: auto;">
        <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 4px solid #6C63FF;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2a2a2a; font-size: 24px; margin: 0;">Order Status Update 📢</h1>
          </div>

          <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
            ${statusMessages[status]}
          </p>

          <div style="text-align: center;">
            <a href="https://artgallery.lenishmagar.me/profile" style="display: inline-block; background: #6C63FF; color: #ffffff; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 5px;">View Your Order</a>
          </div>

          <p style="color: #888; font-size: 14px; margin-top: 20px;">
            If you have any questions, feel free to reach out to us. Happy shopping!
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
    console.error("Failed to send order status email:", error);
    throw new Error("Failed to send order status email");
  }
}