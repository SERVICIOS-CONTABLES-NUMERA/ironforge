import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.cardioSession.findMany({
    orderBy: { date: "desc" },
    take: 50,
  });
  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
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
}
