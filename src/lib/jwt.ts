import jwt from "jsonwebtoken";
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string; 
}

export function signJwt(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string, role: string, name: string, email: string };
   
    return decoded;
  } catch {
    return null;
  }
}

