import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        personalRecords: { orderBy: { date: "desc" } },
        routineDayExercises: { include: { routineDay: true } },
      },
    });
    if (!exercise) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exercise);
  } catch (error) {
    console.error("[GET /api/exercises/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const exercise = await prisma.exercise.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(exercise);
  } catch (error) {
    console.error("[PUT /api/exercises/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.exercise.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/exercises/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
