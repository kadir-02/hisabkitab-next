import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays, dayShort, startOfMonthISO, todayISO } from "@/lib/utils";
import { TiffinCode, TypeBreakdown } from "@/lib/types";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const from = sp.get("from") || startOfMonthISO();
  const to = sp.get("to") || todayISO();
  const today = todayISO();
  const sevenDaysAgo = addDays(today, -6);

  const [rangeRows, recentRows, activeCustomers] = await Promise.all([
    prisma.attendance.findMany({
      where: { date: { gte: from, lte: to } },
      include: { tiffinType: true },
    }),
    prisma.attendance.findMany({
      where: { date: { gte: sevenDaysAgo, lte: today } },
    }),
    prisma.user.count({ where: { is_active: true } }),
  ]);

  const byType: TypeBreakdown = { FULL: 0, HALF: 0, CHAPATI: 0 };
  let totalAmount = 0;
  for (const row of rangeRows) {
    const code = row.tiffinType.code as TiffinCode;
    byType[code] += row.quantity;
    totalAmount += row.price * row.quantity;
  }

  const dailyMap = new Map<string, { lunch: number; dinner: number }>();
  for (const row of recentRows) {
    const day = dailyMap.get(row.date) || { lunch: 0, dinner: 0 };
    if (row.meal === "LUNCH") day.lunch += row.quantity;
    else day.dinner += row.quantity;
    dailyMap.set(row.date, day);
  }

  const recentDays = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, -i);
    const counts = dailyMap.get(d) || { lunch: 0, dinner: 0 };
    recentDays.push({ date: d, day: dayShort(d), lunch: counts.lunch, dinner: counts.dinner });
  }

  return NextResponse.json({
    data: {
      from,
      to,
      total_tiffins: rangeRows.reduce((sum, r) => sum + r.quantity, 0),
      total_amount: totalAmount,
      by_type: byType,
      active_customers: activeCustomers,
      recent_days: recentDays,
    },
  });
}
