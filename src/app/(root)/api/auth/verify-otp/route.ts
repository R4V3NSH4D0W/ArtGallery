import { verifyOtpAction } from "@/app/actions/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password, name } = await req.json();

    const result = await verifyOtpAction(email, otp, password, name);

    return NextResponse.json(result, { status: 200 });
  } catch  {
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 });
  }
}
