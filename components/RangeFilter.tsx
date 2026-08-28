"use client";

import { startOfMonthISO, startOfWeekISO, todayISO, cx } from "@/lib/utils";

export type PresetKey = "today" | "week" | "month" | "custom";

export default function RangeFilter({
  from,
  to,
  preset,
  onChange,
}: {
  from: string;
  to: string;
  preset: PresetKey;
  onChange: (next: { from: string; to: string; preset: PresetKey }) => void;
}) {
  const presets: { key: PresetKey; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This week" },
    { key: "month", label: "This month" },
    { key: "custom", label: "Custom" },
  ];

  function applyPreset(key: PresetKey) {
    const today = todayISO();
    if (key === "today") onChange({ from: today, to: today, preset: key });
    else if (key === "week") onChange({ from: startOfWeekISO(), to: today, preset: key });
    else if (key === "month") onChange({ from: startOfMonthISO(), to: today, preset: key });
    else onChange({ from, to, preset: key });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className={cx(
              "tap-scale whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold",
              preset === p.key
                ? "bg-brand text-white border-brand"
                : "bg-white/60 border-ink/15 text-ink-soft"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-center gap-2">
          <label className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-ink-faint">From</span>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => onChange({ from: e.target.value, to, preset: "custom" })}
              className="rounded-lg border border-ink/15 bg-white/70 px-2.5 py-2 text-xs text-ink outline-none focus:border-brand"
            />
          </label>
          <label className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-ink-faint">To</span>
            <input
              type="date"
              value={to}
              min={from}
              max={todayISO()}
              onChange={(e) => onChange({ from, to: e.target.value, preset: "custom" })}
              className="rounded-lg border border-ink/15 bg-white/70 px-2.5 py-2 text-xs text-ink outline-none focus:border-brand"
            />
          </label>
        </div>
      )}
    </div>
  );
}
