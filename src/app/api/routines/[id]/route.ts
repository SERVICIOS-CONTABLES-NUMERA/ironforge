import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const routine = await prisma.routine.findUnique({
    where: { id },
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
  });
  if (!routine) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(routine);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const routine = await prisma.routine.update({
    where: { id },
    data: { name: body.name, isActive: body.isActive },
  });
  return NextResponse.json(routine);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.routine.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
