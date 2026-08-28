import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays, dayShort, startOfMonthISO, todayISO } from "@/lib/utils";
import { CustomerSummary, DailyBreakdown, TiffinCode, TypeBreakdown } from "@/lib/types";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const from = sp.get("from") || startOfMonthISO();
  const to = sp.get("to") || todayISO();

  const rows = await prisma.attendance.findMany({
    where: { date: { gte: from, lte: to } },
    include: { user: true, tiffinType: true },
  });

  const byType: TypeBreakdown = { FULL: 0, HALF: 0, CHAPATI: 0 };
  const dailyMap = new Map<string, { lunch: number; dinner: number }>();
  const customerMap = new Map<string, CustomerSummary>();
  let totalAmount = 0;

  for (const row of rows) {
    const code = row.tiffinType.code as TiffinCode;
    byType[code] += row.quantity;
    totalAmount += row.price * row.quantity;

    const day = dailyMap.get(row.date) || { lunch: 0, dinner: 0 };
    if (row.meal === "LUNCH") day.lunch += row.quantity;
    else day.dinner += row.quantity;
    dailyMap.set(row.date, day);

    const entry =
      customerMap.get(row.user.id) ||
      ({
        customer_id: row.user.id,
        name: row.user.name,
        full: 0,
        half: 0,
        chapati: 0,
        total: 0,
        amount: 0,
      } as CustomerSummary);
    if (code === "FULL") entry.full += row.quantity;
    if (code === "HALF") entry.half += row.quantity;
    if (code === "CHAPATI") entry.chapati += row.quantity;
    entry.total += row.quantity;
    entry.amount += row.price * row.quantity;
    customerMap.set(row.user.id, entry);
  }

  const daily: DailyBreakdown[] = [];
  for (let d = to; d >= from; d = addDays(d, -1)) {
    const counts = dailyMap.get(d) || { lunch: 0, dinner: 0 };
    daily.push({ date: d, day: dayShort(d), lunch: counts.lunch, dinner: counts.dinner });
    if (daily.length > 62) break; // safety guard for very large ranges
  }

  const customers = [...customerMap.values()].sort((a, b) => b.amount - a.amount);

  return NextResponse.json({
    data: {
      from,
      to,
      total_tiffins: rows.reduce((sum, r) => sum + r.quantity, 0),
      total_amount: totalAmount,
      by_type: byType,
      daily,
      customers,
    },
  });
}
