import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

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
    console.error("Error verifying JWT:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
