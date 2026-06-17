import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.personalRecord.findMany({
      include: { exercise: true },
      orderBy: { date: "desc" },
      take: 20,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("[GET /api/records]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
