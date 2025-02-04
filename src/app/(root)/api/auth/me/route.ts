import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split("; ")
    .find(c => c.startsWith("auth_token="))?.split("=")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const decoded = verifyJwt(token);

  if (!decoded|| !decoded.email || !decoded.name) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ 
    authenticated: true, 
    user: { 
      name: decoded.name, 
      email: decoded.email 
    } 
  });
}
