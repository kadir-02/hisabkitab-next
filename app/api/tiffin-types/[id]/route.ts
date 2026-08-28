import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/server-utils";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const existing = await prisma.tiffinType.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Tiffin type not found.", 404);

  const body = await request.json().catch(() => ({}));
  const data: { price?: number; name?: string; is_active?: boolean } = {};

  if (typeof body.price === "number" && body.price >= 0) data.price = body.price;
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.is_active === "boolean") data.is_active = body.is_active;

  const type = await prisma.tiffinType.update({ where: { id: params.id }, data });
  return NextResponse.json({ data: type });
}
