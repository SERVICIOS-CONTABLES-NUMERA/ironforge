import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const session = await prisma.cardioSession.update({
      where: { id },
      data: {
        type: body.type,
        duration: body.duration,
        distance: body.distance ?? undefined,
        calories: body.calories ?? undefined,
        notes: body.notes ?? undefined,
      },
    });
    return NextResponse.json(session);
  } catch (error) {
    console.error("[PUT /api/cardio/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.cardioSession.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/cardio/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
