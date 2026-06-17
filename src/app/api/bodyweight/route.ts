import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.bodyweightLog.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET /api/bodyweight]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error("[POST /api/bodyweight]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
