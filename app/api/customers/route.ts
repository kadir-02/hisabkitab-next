import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/server-utils";

export async function GET(request: NextRequest) {
  const activeParam = request.nextUrl.searchParams.get("active");
  const where =
    activeParam === "true" ? { is_active: true } : activeParam === "false" ? { is_active: false } : {};

  const customers = await prisma.user.findMany({ where, orderBy: { name: "asc" } });
  return NextResponse.json({ data: customers });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return jsonError("Customer name is required.");
  }

  const customer = await prisma.user.create({
    data: {
      name: body.name.trim(),
      phone: body.phone ? String(body.phone).trim() : null,
      is_active: body.is_active ?? true,
    },
  });

  return NextResponse.json({ data: customer }, { status: 201 });
}
