import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessions = await prisma.cardioSession.findMany({
      orderBy: { date: "desc" },
      take: 50,
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[GET /api/cardio]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await prisma.cardioSession.create({
      data: {
        date: new Date(body.date),
        type: body.type,
        duration: body.duration,
        distance: body.distance || null,
        calories: body.calories || null,
        notes: body.notes || null,
      },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("[POST /api/cardio]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
