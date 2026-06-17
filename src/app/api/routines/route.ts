import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const routines = await prisma.routine.findMany({
      include: {
        versions: {
          include: {
            days: {
              include: {
                exercises: {
                  include: { exercise: true },
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { version: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(routines);
  } catch (error) {
    console.error("[GET /api/routines]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const routine = await prisma.routine.create({
      data: {
        name: body.name,
        isActive: body.isActive || false,
        versions: {
          create: {
            version: 1,
            days: {
              create: (body.days || []).map((day: any, idx: number) => ({
                name: day.name,
                order: idx,
                exercises: {
                  create: (day.exercises || []).map((ex: any, eidx: number) => ({
                    exerciseId: ex.exerciseId,
                    sets: ex.sets,
                    reps: ex.reps,
                    order: eidx,
                  })),
                },
              })),
            },
          },
        },
      },
      include: {
        versions: {
          include: {
            days: {
              include: { exercises: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
    return NextResponse.json(routine, { status: 201 });
  } catch (error) {
    console.error("[POST /api/routines]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
