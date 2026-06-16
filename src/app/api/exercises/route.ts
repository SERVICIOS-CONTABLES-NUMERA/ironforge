import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const group = searchParams.get("group") || "";

  const where: any = {};
  if (query) where.name = { contains: query };
  if (group) where.mainMuscleGroup = group;

  const exercises = await prisma.exercise.findMany({
    where,
    include: { personalRecords: { orderBy: { date: "desc" }, take: 1 } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(exercises);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const exercise = await prisma.exercise.create({ data: body });
  return NextResponse.json(exercise, { status: 201 });
}
