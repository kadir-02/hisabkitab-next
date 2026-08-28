"use client";

import { useEffect, useState } from "react";
import { ReportsApi } from "@/lib/api-client";
import { ReportSummary } from "@/lib/types";
import { formatCurrency, startOfMonthISO, todayISO } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import RangeFilter, { PresetKey } from "@/components/RangeFilter";
import StatCard from "@/components/StatCard";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import CustomerDetailModal from "@/components/CustomerDetailModal";
import { ChevronRight, ReceiptText } from "lucide-react";

export default function ReportsPage() {
  const [preset, setPreset] = useState<PresetKey>("month");
  const [from, setFrom] = useState(startOfMonthISO());
  const [to, setTo] = useState(todayISO());
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ReportsApi.summary(from, to)
      .then((res) => !cancelled && setSummary(res))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return (
    <div className="ledger-page min-h-full">
      <PageHeader eyebrow="Billing" title="Reports" />

      <div className="px-5 pt-4 pb-2">
        <RangeFilter
          from={from}
          to={to}
          preset={preset}
          onChange={(next) => {
            setPreset(next.preset);
            setFrom(next.from);
            setTo(next.to);
          }}
        />
      </div>

      <div className="px-5 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-brand-dark bg-brand/10 rounded-lg px-3 py-2 mt-3">{error}</p>
        )}

        {summary && !loading && (
          <div className="flex flex-col gap-5 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total tiffins" value={String(summary.total_tiffins)} big accent="brand" />
              <StatCard label="Total amount" value={formatCurrency(summary.total_amount)} big accent="brand" />
              <StatCard label="Full" value={String(summary.by_type.FULL)} accent="full" />
              <StatCard label="Half" value={String(summary.by_type.HALF)} accent="half" />
              <StatCard label="Chapati" value={String(summary.by_type.CHAPATI)} accent="chapati" />
            </div>

            <div>
              <h2 className="text-[11px] uppercase tracking-wide text-ink-faint font-semibold mb-2">
                Daily breakdown
              </h2>
              {summary.daily.length === 0 ? (
                <p className="text-xs text-ink-faint">No entries in this range.</p>
              ) : (
                <div className="bg-white/50 rounded-card border border-ink/10 overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-paper-dark/90">
                      <tr className="text-[11px] uppercase text-ink-faint border-b border-ink/10">
                        <th className="text-left font-medium py-2 px-3">Date</th>
                        <th className="text-left font-medium py-2 px-3">Day</th>
                        <th className="text-right font-medium py-2 px-3">Lunch</th>
                        <th className="text-right font-medium py-2 px-3">Dinner</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {summary.daily.map((row) => (
                        <tr key={row.date} className="border-b border-ink/5 last:border-0">
                          <td className="py-2 px-3 font-body text-ink">{row.date.slice(8, 10)} {row.date.slice(5, 7)}</td>
                          <td className="py-2 px-3 font-body text-ink-soft">{row.day}</td>
                          <td className="py-2 px-3 text-right text-ink">{row.lunch}</td>
                          <td className="py-2 px-3 text-right text-ink">{row.dinner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-[11px] uppercase tracking-wide text-ink-faint font-semibold mb-2">
                Customer summary
              </h2>
              {summary.customers.length === 0 ? (
                <EmptyState
                  icon={<ReceiptText size={26} className="text-ink-faint" />}
                  title="Nothing to bill yet"
                  description="Mark some attendance in this date range to see customer totals."
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {summary.customers.map((c) => (
                    <button
                      key={c.customer_id}
                      onClick={() => setSelectedCustomer(c.customer_id)}
                      className="tap-scale bg-white/50 rounded-card border border-ink/10 px-4 py-3 flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="font-display font-semibold text-ink text-[15px]">{c.name}</p>
                        <p className="text-[11px] text-ink-faint font-mono">
                          F {c.full} · H {c.half} · C {c.chapati} · {c.total} total
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-brand">{formatCurrency(c.amount)}</span>
                        <ChevronRight size={16} className="text-ink-faint" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetailModal
          customerId={selectedCustomer}
          from={from}
          to={to}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
