import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const activeRoutine = await prisma.routine.findFirst({
    where: { isActive: true },
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
        take: 1,
      },
    },
  });

  if (!activeRoutine) {
    return NextResponse.json({ routine: null, day: null });
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const version = activeRoutine.versions[0];
  const dayIndex = dayOfWeek === 0 ? 2 : dayOfWeek - 1; // Sun=2(legs), Mon=0(push), etc.
  const day = version?.days?.[dayIndex % version.days.length] || null;

  return NextResponse.json({
    routine: activeRoutine,
    version,
    day,
  });
}
