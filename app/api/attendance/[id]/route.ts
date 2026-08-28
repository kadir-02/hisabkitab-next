import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/server-utils";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const existing = await prisma.attendance.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Attendance record not found.", 404);

  const body = await request.json().catch(() => ({}));
  const data: { tiffin_type_id?: string; price?: number; quantity?: number } = {};

  if (typeof body.tiffin_type_id === "string") {
    const type = await prisma.tiffinType.findUnique({ where: { id: body.tiffin_type_id } });
    if (!type) return jsonError("Tiffin type not found.", 404);
    data.tiffin_type_id = type.id;
    data.price = type.price;
  }
  if (typeof body.quantity === "number" && body.quantity > 0) data.quantity = body.quantity;

  const record = await prisma.attendance.update({ where: { id: params.id }, data });
  return NextResponse.json({ data: record });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const existing = await prisma.attendance.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Attendance record not found.", 404);

  await prisma.attendance.delete({ where: { id: params.id } });
  return NextResponse.json({ data: { id: params.id, deleted: true } });
}
