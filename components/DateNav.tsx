"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { addDays, dayFull, formatDisplayDate, isToday, todayISO } from "@/lib/utils";
import { useRef } from "react";

export default function DateNav({
  date,
  onChange,
}: {
  date: string;
  onChange: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between bg-white/60 rounded-card border border-ink/10 px-3 py-2.5">
      <button
        aria-label="Previous day"
        onClick={() => onChange(addDays(date, -1))}
        className="p-2 rounded-full hover:bg-ink/5 tap-scale text-ink-soft"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        className="flex flex-col items-center tap-scale"
        onClick={() => inputRef.current?.showPicker?.() ?? inputRef.current?.focus()}
      >
        <span className="flex items-center gap-1.5 font-display font-semibold text-ink text-base">
          <CalendarDays size={15} className="text-brand" />
          {formatDisplayDate(date)}
        </span>
        <span className="text-[11px] text-ink-faint">
          {isToday(date) ? "Today · " : ""}
          {dayFull(date)}
        </span>
        <input
          ref={inputRef}
          type="date"
          value={date}
          max={todayISO()}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
      </button>

      <button
        aria-label="Next day"
        onClick={() => onChange(addDays(date, 1))}
        disabled={date >= todayISO()}
        className="p-2 rounded-full hover:bg-ink/5 tap-scale text-ink-soft disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
