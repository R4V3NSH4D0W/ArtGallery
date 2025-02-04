import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set("auth_token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), 
  });

  return response;
}
