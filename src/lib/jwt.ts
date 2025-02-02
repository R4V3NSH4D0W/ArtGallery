import jwt from "jsonwebtoken";


export function signJwt(payload: object) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}


export function verifyJwt(token: string) {
  const secret = process.env.JWT_SECRET;
    try {
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }
   
      const decoded = jwt.verify(token, secret) as unknown as { name: string, email: string };
  
      return { name: decoded.name, email: decoded.email };
    } catch {
      return null; 
    }
  }
