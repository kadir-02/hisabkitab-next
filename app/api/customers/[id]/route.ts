import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/server-utils";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const customer = await prisma.user.findUnique({ where: { id: params.id } });
  if (!customer) return jsonError("Customer not found.", 404);
  return NextResponse.json({ data: customer });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const existing = await prisma.user.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Customer not found.", 404);

  const body = await request.json().catch(() => ({}));
  const data: { name?: string; phone?: string | null; is_active?: boolean } = {};

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if ("phone" in body) data.phone = body.phone ? String(body.phone).trim() : null;
  if (typeof body.is_active === "boolean") data.is_active = body.is_active;

  const customer = await prisma.user.update({ where: { id: params.id }, data });
  return NextResponse.json({ data: customer });
}
