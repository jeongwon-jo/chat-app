import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("필드를 모두 입력해주세요", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, hashedPassword },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("REGISTER_ERROR", error);
    if (error?.code === "P2002") {
      return new NextResponse("이미 사용 중인 이메일입니다", { status: 409 });
    }
    return new NextResponse(error?.message ?? "서버 오류", { status: 500 });
  }
}