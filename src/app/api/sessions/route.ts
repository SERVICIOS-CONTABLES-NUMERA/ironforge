import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const routineId = searchParams.get("routineId") || "";
    const exerciseId = searchParams.get("exerciseId") || "";
    const exerciseName = searchParams.get("exerciseName") || "";

    const where: any = {};
    if (routineId) where.routineId = routineId;
    if (exerciseId) where.exercises = { some: { exerciseId } };
    if (exerciseName) where.exercises = { some: { exercise: { name: { contains: exerciseName } } } };

    const [sessions, total] = await Promise.all([
      prisma.workoutSession.findMany({
        where,
        include: {
          exercises: {
            include: { exercise: true },
            orderBy: { order: "asc" },
          },
          routineVersion: true,
        },
        orderBy: { date: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.workoutSession.count({ where }),
    ]);

    return NextResponse.json({ sessions, total });
  } catch (error) {
    console.error("[GET /api/sessions]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const session = await prisma.workoutSession.create({
      data: {
        date: new Date(body.date),
        routineId: body.routineId || null,
        routineVersionId: body.routineVersionId || null,
        notes: body.notes || null,
        exercises: {
          create: (body.exercises || []).map((ex: any, idx: number) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            rir: ex.rir || null,
            notes: ex.notes || null,
            order: idx,
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: "asc" },
        },
      },
    });

    // Check for personal records
    for (const ex of body.exercises || []) {
      const volume = ex.weight * ex.sets * ex.reps;

      const [maxWeightRecord, maxVolumeRecord] = await Promise.all([
        prisma.personalRecord.findFirst({
          where: { exerciseId: ex.exerciseId, type: "MAX_WEIGHT" },
          orderBy: { weight: "desc" },
        }),
        prisma.personalRecord.findFirst({
          where: { exerciseId: ex.exerciseId, type: "MAX_VOLUME" },
          orderBy: { volume: "desc" },
        }),
      ]);

      if (!maxWeightRecord || ex.weight > maxWeightRecord.weight) {
        await prisma.personalRecord.create({
          data: {
            exerciseId: ex.exerciseId,
            weight: ex.weight,
            reps: ex.reps,
            volume,
            date: new Date(body.date),
            type: "MAX_WEIGHT",
          },
        });
      }

      if (!maxVolumeRecord || volume > (maxVolumeRecord.volume || 0)) {
        await prisma.personalRecord.create({
          data: {
            exerciseId: ex.exerciseId,
            weight: ex.weight,
            reps: ex.reps,
            volume,
            date: new Date(body.date),
            type: "MAX_VOLUME",
          },
        });
      }
    }

    // Update streak
    await updateStreak();

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sessions]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function updateStreak() {
  const sessions = await prisma.workoutSession.findMany({
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (sessions.length === 0) return;

  const dates = [...new Set(sessions.map((s) => s.date.toISOString().split("T")[0]))].sort().reverse();

  let currentStreak = 0;
  const today = new Date().toISOString().split("T")[0];
  let checkDate = new Date(today);

  for (const dateStr of dates) {
    const expected = checkDate.toISOString().split("T")[0];
    if (dateStr === expected) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const streak = await prisma.streak.findFirst();
  if (streak) {
    await prisma.streak.update({
      where: { id: streak.id },
      data: {
        current: currentStreak,
        best: Math.max(streak.best, currentStreak),
      },
    });
  }
}

