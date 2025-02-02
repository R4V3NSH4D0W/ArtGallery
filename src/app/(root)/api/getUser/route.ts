import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {

  const token = req.headers.get('Authorization')?.split(' ')[1] || null;


  if (!token) {
    return NextResponse.json({ message: 'Token not provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { name: string; email: string };
    return NextResponse.json({
      name: decoded.name,
      email: decoded.email,
    });
  } catch  {
   
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
