"use client";

import { TiffinType } from "@/lib/types";
import { cx } from "@/lib/utils";

const STYLE_BY_CODE: Record<string, { active: string; label: string }> = {
  FULL: { active: "bg-full text-white border-full", label: "Full" },
  HALF: { active: "bg-half text-white border-half", label: "Half" },
  CHAPATI: { active: "bg-chapati text-white border-chapati", label: "Chapati" },
};

export default function MealSelector({
  mealLabel,
  types,
  selectedTypeId,
  onSelect,
  disabled,
}: {
  mealLabel: string;
  types: TiffinType[];
  selectedTypeId: string | null;
  onSelect: (typeId: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-1.5">{mealLabel}</p>
      <div className="grid grid-cols-3 gap-1.5">
        {types.map((type) => {
          const isSelected = selectedTypeId === type.id;
          const style = STYLE_BY_CODE[type.code] || STYLE_BY_CODE.FULL;
          return (
            <button
              key={type.id}
              disabled={disabled}
              onClick={() => onSelect(isSelected ? null : type.id)}
              className={cx(
                "tap-scale rounded-lg border text-xs font-semibold py-2 transition-colors disabled:opacity-50",
                isSelected
                  ? style.active
                  : "bg-white/70 border-ink/15 text-ink-soft hover:border-ink/30"
              )}
            >
              {style.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
