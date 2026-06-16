import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const streak = await prisma.streak.findFirst();
  return NextResponse.json(streak || { current: 0, best: 0 });
}
