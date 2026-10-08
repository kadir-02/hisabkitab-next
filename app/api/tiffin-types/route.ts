import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const types = await prisma.tiffinType.findMany({ orderBy: { price: "desc" } });
  return NextResponse.json({ data: types });
}
