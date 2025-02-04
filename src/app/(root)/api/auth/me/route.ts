import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie");
  const token = cookies
    ?.split("; ")
    .find((cookie) => cookie.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    
    const decoded = await verifyJwt(token); 

  
    if (!decoded || !decoded.email || !decoded.name) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
      },
    });
  } catch (error) {
    console.error("Error verifying JWT:", error); // Log errors
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
