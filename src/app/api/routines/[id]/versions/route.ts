import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const routine = await prisma.routine.findUnique({
    where: { id },
    include: {
      versions: {
        include: { days: { include: { exercises: true }, orderBy: { order: "asc" } } },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!routine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const currentVersion = routine.versions[0];
  const newVersionNum = currentVersion.version + 1;

  const newVersion = await prisma.routineVersion.create({
    data: {
      version: newVersionNum,
      routineId: id,
      days: {
        create: currentVersion.days.map((day) => ({
          name: day.name,
          order: day.order,
          exercises: {
            create: day.exercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              sets: ex.sets,
              reps: ex.reps,
              order: ex.order,
            })),
          },
        })),
      },
    },
    include: {
      days: {
        include: { exercises: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(newVersion, { status: 201 });
}
