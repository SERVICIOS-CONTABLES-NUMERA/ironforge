import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    streak,
    bodyweight,
    sessions,
    volumeData,
    weeklyVolume,
    monthlyVolume,
    records,
    cardioTotal,
    recentSessions,
  ] = await Promise.all([
    prisma.streak.findFirst(),
    prisma.bodyweightLog.findFirst({ orderBy: { date: "desc" } }),
    prisma.workoutSession.count({ where: { date: { gte: monthStart } } }),
    prisma.sessionExercise.aggregate({ _sum: { weight: true } }),
    prisma.sessionExercise.findMany({
      where: { session: { date: { gte: weekAgo } } },
      select: { weight: true, sets: true, reps: true, session: { select: { date: true } } },
    }),
    prisma.sessionExercise.findMany({
      where: { session: { date: { gte: monthStart } } },
      select: { weight: true, sets: true, reps: true },
    }),
    prisma.personalRecord.findMany({
      include: { exercise: true },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.cardioSession.aggregate({ _sum: { duration: true, calories: true } }),
    prisma.workoutSession.findMany({
      include: {
        exercises: { include: { exercise: true } },
        routineVersion: true,
      },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const lastMonthBodyweights = await prisma.bodyweightLog.findMany({
    where: { date: { gte: monthStart } },
    orderBy: { date: "asc" },
  });

  const avgMonthlyWeight = lastMonthBodyweights.length > 0
    ? lastMonthBodyweights.reduce((s, l) => s + l.weight, 0) / lastMonthBodyweights.length
    : null;

  const weeklyVol = weeklyVolume.reduce((sum, se) => sum + se.weight * se.sets * se.reps, 0);
  const monthlyVol = monthlyVolume.reduce((sum, se) => sum + se.weight * se.sets * se.reps, 0);

  const weightHistory = await prisma.bodyweightLog.findMany({
    orderBy: { date: "asc" },
    take: 90,
  });

  const volumeByWeek = await prisma.$queryRaw`
    SELECT 
      strftime('%Y-%W', ws.date) as week,
      SUM(se.weight * se.sets * se.reps) as volume
    FROM SessionExercise se
    JOIN WorkoutSession ws ON se.sessionId = ws.id
    WHERE ws.date >= ${new Date(now.getFullYear(), 0, 1)}
    GROUP BY week
    ORDER BY week
  `;

  return NextResponse.json({
    streak: streak || { current: 0, best: 0 },
    currentWeight: bodyweight?.weight || null,
    avgMonthlyWeight,
    monthlySessions: sessions,
    totalVolume: volumeData._sum.weight || 0,
    weeklyVolume: weeklyVol,
    monthlyVolume: monthlyVol,
    recentRecords: records,
    cardioTotal: {
      duration: cardioTotal._sum.duration || 0,
      calories: cardioTotal._sum.calories || 0,
    },
    recentSessions,
    weightHistory,
  });
}
