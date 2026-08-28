import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUniqueConstraintError, jsonError } from "@/lib/server-utils";
import { Meal } from "@/lib/types";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const date = sp.get("date");
  const from = sp.get("from");
  const to = sp.get("to");
  const userId = sp.get("user_id");
  const meal = sp.get("meal") as Meal | null;

  const where: Prisma.AttendanceWhereInput = {};
  if (date) where.date = date;
  if (from || to) where.date = { ...(where.date as object), gte: from ?? undefined, lte: to ?? undefined };
  if (userId) where.user_id = userId;
  if (meal) where.meal = meal;

  const rows = await prisma.attendance.findMany({ where, orderBy: { date: "desc" } });
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || !body.user_id || !body.date || !body.meal || !body.tiffin_type_id) {
    return jsonError("user_id, date, meal and tiffin_type_id are required.");
  }

  const customer = await prisma.user.findUnique({ where: { id: body.user_id } });
  if (!customer) return jsonError("Customer not found.", 404);

  const type = await prisma.tiffinType.findUnique({ where: { id: body.tiffin_type_id } });
  if (!type) return jsonError("Tiffin type not found.", 404);

  try {
    const record = await prisma.attendance.create({
      data: {
        user_id: body.user_id,
        date: body.date,
        meal: body.meal as Meal,
        tiffin_type_id: body.tiffin_type_id,
        quantity: typeof body.quantity === "number" && body.quantity > 0 ? body.quantity : 1,
        price: type.price,
      },
    });
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return jsonError(
        "An attendance record already exists for this customer, date and meal. Use PATCH to update it.",
        409
      );
    }
    throw err;
  }
}
