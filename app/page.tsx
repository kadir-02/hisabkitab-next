"use client";

import { useEffect, useState } from "react";
import { DashboardApi } from "@/lib/api-client";
import { DashboardData } from "@/lib/types";
import { formatCurrency, startOfMonthISO, startOfWeekISO, todayISO, cx } from "@/lib/utils";
import Wordmark from "@/components/Wordmark";
import StatCard from "@/components/StatCard";
import Spinner from "@/components/Spinner";
import { BookOpen } from "lucide-react";

type Preset = "today" | "week" | "month";

export default function DashboardPage() {
  const [preset, setPreset] = useState<Preset>("month");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const today = todayISO();
    const from = preset === "today" ? today : preset === "week" ? startOfWeekISO() : startOfMonthISO();

    setLoading(true);
    DashboardApi.get(from, today)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [preset]);

  return (
    <div className="ledger-page min-h-full">
      <header className="px-5 pt-6 pb-4">
        <Wordmark />
      </header>

      <div className="px-5 pb-6 flex flex-col gap-5">
        <div className="flex gap-1.5">
          {(["today", "week", "month"] as Preset[]).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={cx(
                "tap-scale rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize",
                preset === p ? "bg-brand text-white border-brand" : "bg-white/60 border-ink/15 text-ink-soft"
              )}
            >
              {p === "today" ? "Today" : p === "week" ? "This week" : "This month"}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-brand-dark bg-brand/10 rounded-lg px-3 py-2">{error}</p>
        )}

        {data && !loading && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total tiffins" value={String(data.total_tiffins)} big accent="brand" />
              <StatCard label="Total amount" value={formatCurrency(data.total_amount)} big accent="brand" />
              <StatCard label="Full" value={String(data.by_type.FULL)} accent="full" />
              <StatCard label="Half" value={String(data.by_type.HALF)} accent="half" />
              <StatCard label="Chapati" value={String(data.by_type.CHAPATI)} accent="chapati" />
              <StatCard label="Active customers" value={String(data.active_customers)} />
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen size={14} className="text-brand" />
                <h2 className="text-xs uppercase tracking-wide text-ink-faint font-semibold">
                  Last 7 days
                </h2>
              </div>
              <div className="bg-white/50 rounded-card border border-ink/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase text-ink-faint border-b border-ink/10">
                      <th className="text-left font-medium py-2 px-3">Date</th>
                      <th className="text-right font-medium py-2 px-3">Lunch</th>
                      <th className="text-right font-medium py-2 px-3">Dinner</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {data.recent_days.map((row) => (
                      <tr key={row.date} className="border-b border-ink/5 last:border-0">
                        <td className="py-2 px-3 font-body text-ink">
                          {row.day}{" "}
                          <span className="text-ink-faint text-xs">{row.date.slice(8, 10)}</span>
                        </td>
                        <td className="py-2 px-3 text-right text-ink">{row.lunch}</td>
                        <td className="py-2 px-3 text-right text-ink">{row.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
