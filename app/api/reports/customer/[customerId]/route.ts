import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/server-utils";
import { startOfMonthISO, todayISO } from "@/lib/utils";
import { CustomerReportEntry, TiffinCode } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  const customer = await prisma.user.findUnique({ where: { id: params.customerId } });
  if (!customer) return jsonError("Customer not found.", 404);

  const sp = request.nextUrl.searchParams;
  const from = sp.get("from") || startOfMonthISO();
  const to = sp.get("to") || todayISO();

  const rows = await prisma.attendance.findMany({
    where: { user_id: customer.id, date: { gte: from, lte: to } },
    include: { tiffinType: true },
    orderBy: { date: "desc" },
  });

  const entries: CustomerReportEntry[] = rows.map((r) => ({
    id: r.id,
    date: r.date,
    meal: r.meal as CustomerReportEntry["meal"],
    tiffin_type: r.tiffinType.name,
    code: r.tiffinType.code as TiffinCode,
    quantity: r.quantity,
    price: r.price,
  }));

  const totals = entries.reduce(
    (acc, e) => {
      if (e.code === "FULL") acc.full += e.quantity;
      if (e.code === "HALF") acc.half += e.quantity;
      if (e.code === "CHAPATI") acc.chapati += e.quantity;
      acc.total += e.quantity;
      acc.amount += e.price * e.quantity;
      return acc;
    },
    { full: 0, half: 0, chapati: 0, total: 0, amount: 0 }
  );

  return NextResponse.json({ data: { customer, from, to, entries, totals } });
}
