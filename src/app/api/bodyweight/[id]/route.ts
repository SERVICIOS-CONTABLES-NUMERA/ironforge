import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const log = await prisma.bodyweightLog.update({
    where: { id },
    data: {
      weight: body.weight,
      bodyFat: body.bodyFat ?? undefined,
      notes: body.notes ?? undefined,
    },
  });
  return NextResponse.json(log);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.bodyweightLog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
