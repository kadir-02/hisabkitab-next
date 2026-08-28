"use client";

import { Customer, TiffinType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import MealSelector from "./MealSelector";

export default function CustomerAttendanceRow({
  customer,
  types,
  lunchTypeId,
  dinnerTypeId,
  onSelectLunch,
  onSelectDinner,
  busy,
}: {
  customer: Customer;
  types: TiffinType[];
  lunchTypeId: string | null;
  dinnerTypeId: string | null;
  onSelectLunch: (typeId: string | null) => void;
  onSelectDinner: (typeId: string | null) => void;
  busy: boolean;
}) {
  const typeById = new Map(types.map((t) => [t.id, t]));
  const lunchPrice = lunchTypeId ? typeById.get(lunchTypeId)?.price || 0 : 0;
  const dinnerPrice = dinnerTypeId ? typeById.get(dinnerTypeId)?.price || 0 : 0;
  const total = lunchPrice + dinnerPrice;

  return (
    <div className="bg-white/50 rounded-card border border-ink/10 p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-display font-semibold text-ink text-[15px]">{customer.name}</p>
          {customer.phone && <p className="text-[11px] text-ink-faint">{customer.phone}</p>}
        </div>
        {total > 0 && (
          <span className="font-mono text-sm font-semibold text-brand">{formatCurrency(total)}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MealSelector
          mealLabel="Lunch"
          types={types}
          selectedTypeId={lunchTypeId}
          onSelect={onSelectLunch}
          disabled={busy}
        />
        <MealSelector
          mealLabel="Dinner"
          types={types}
          selectedTypeId={dinnerTypeId}
          onSelect={onSelectDinner}
          disabled={busy}
        />
      </div>
    </div>
  );
}
