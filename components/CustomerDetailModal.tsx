"use client";

import { useEffect, useState } from "react";
import { ReportsApi } from "@/lib/api-client";
import { CustomerReport } from "@/lib/types";
import { formatCurrency, formatDisplayDate } from "@/lib/utils";
import Modal from "./Modal";
import Spinner from "./Spinner";

const CODE_COLOR: Record<string, string> = {
  FULL: "text-full",
  HALF: "text-half",
  CHAPATI: "text-chapati",
};

export default function CustomerDetailModal({
  customerId,
  from,
  to,
  onClose,
}: {
  customerId: string;
  from: string;
  to: string;
  onClose: () => void;
}) {
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ReportsApi.customer(customerId, from, to)
      .then(setReport)
      .finally(() => setLoading(false));
  }, [customerId, from, to]);

  return (
    <Modal title={report?.customer.name || "Customer bill"} onClose={onClose}>
      {loading || !report ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-ink-faint">
            {formatDisplayDate(report.from)} – {formatDisplayDate(report.to)}
          </p>

          <div className="grid grid-cols-4 gap-2 text-center">
            <MiniStat label="Full" value={report.totals.full} colorClass="text-full" />
            <MiniStat label="Half" value={report.totals.half} colorClass="text-half" />
            <MiniStat label="Chapati" value={report.totals.chapati} colorClass="text-chapati" />
            <MiniStat label="Total" value={report.totals.total} colorClass="text-ink" />
          </div>

          <div className="bg-ink text-paper rounded-card px-4 py-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-paper/60">Amount due</span>
            <span className="font-mono font-bold text-lg">{formatCurrency(report.totals.amount)}</span>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-wide text-ink-faint font-semibold mb-2">
              Entries
            </h3>
            {report.entries.length === 0 ? (
              <p className="text-xs text-ink-faint">No attendance in this range.</p>
            ) : (
              <div className="max-h-56 overflow-y-auto flex flex-col divide-y divide-ink/10">
                {report.entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <p className="text-ink">{formatDisplayDate(entry.date)}</p>
                      <p className="text-[11px] text-ink-faint">
                        {entry.meal === "LUNCH" ? "Lunch" : "Dinner"} ·{" "}
                        <span className={CODE_COLOR[entry.code]}>{entry.tiffin_type}</span>
                      </p>
                    </div>
                    <span className="font-mono text-ink">{formatCurrency(entry.price * entry.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function MiniStat({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="bg-white/60 rounded-lg border border-ink/10 py-2">
      <p className={`font-mono font-semibold ${colorClass}`}>{value}</p>
      <p className="text-[10px] text-ink-faint uppercase">{label}</p>
    </div>
  );
}
