import { sendOtpAction } from "@/app/actions/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log(email)

    const result = await sendOtpAction(email);

    return NextResponse.json(result, { status: 200 });
  } catch (error )  {
    if ((error as Error).message === "Email already exists") {
      return NextResponse.json({ message: (error as Error).message }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
