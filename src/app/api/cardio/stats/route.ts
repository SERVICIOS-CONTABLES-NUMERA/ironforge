import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.cardioSession.findMany({
    select: { duration: true, distance: true, calories: true },
  });

  const total = sessions.reduce<{ duration: number; distance: number; calories: number }>(
    (acc, s) => ({
      duration: acc.duration + s.duration,
      distance: acc.distance + (s.distance ?? 0),
      calories: acc.calories + (s.calories ?? 0),
    }),
    { duration: 0, distance: 0, calories: 0 }
  );

  const thisMonth = await prisma.cardioSession.findMany({
    where: {
      date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    },
    select: { duration: true },
  });

  const monthlyDuration = thisMonth.reduce((sum, s) => sum + s.duration, 0);

  return NextResponse.json({ ...total, sessions: sessions.length, monthlyDuration });
}
