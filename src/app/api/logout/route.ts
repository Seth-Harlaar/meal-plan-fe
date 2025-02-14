import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(`${process.env.BASE_URL}/`);
  
  // Remove the cookie
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return res;
}
