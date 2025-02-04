import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";


export async function POST(req: Request) {
  try {
   
    const { email, password } = await req.json();


    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
    }

    const token =signJwt(  { id: user.id, role: user.role, name: user.name, email: user.email });

  
    const response = NextResponse.json({
      message: "Login successful",
      redirectUrl: user.role === "ADMIN" ? "/admin-dashboard" : "/",
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
