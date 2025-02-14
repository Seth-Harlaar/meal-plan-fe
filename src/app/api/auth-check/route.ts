import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (token) {
    console.log("auth", token);
    return new NextResponse("Authenticated", { status: 200 });
  } else {
    console.log("not");
    return new NextResponse("Unauthorized", { status: 401 });
  }
}