import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/libs/authOptions";

export { authOptions };

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  return handler(req, ctx);
}
