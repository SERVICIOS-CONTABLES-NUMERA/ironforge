import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const logs = await prisma.bodyweightLog.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(logs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const log = await prisma.bodyweightLog.create({
    data: {
      date: new Date(body.date),
      weight: body.weight,
      bodyFat: body.bodyFat || null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(log, { status: 201 });
}
