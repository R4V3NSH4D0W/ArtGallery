import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const cookies = req.headers.get("cookie");
  const token = cookies
    ?.split("; ")
    .find((cookie) => cookie.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
  
    const apiUrl = new URL("http://localhost:4000/api/auth/me");
    const res = await fetch(apiUrl, {
      headers: {
        'Cookie': `auth_token=${token}`,
      },
    });
    

    const data = await res.json();

    if (!data.authenticated || data.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error calling /api/auth/me:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: "/dashboard/:path*", 
};
