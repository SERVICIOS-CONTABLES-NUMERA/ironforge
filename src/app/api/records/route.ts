import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.personalRecord.findMany({
    include: { exercise: true },
    orderBy: { date: "desc" },
    take: 20,
  });
  return NextResponse.json(records);
}
