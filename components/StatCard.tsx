import { cx } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  accent,
  big,
}: {
  label: string;
  value: string;
  accent?: "full" | "half" | "chapati" | "brand";
  big?: boolean;
}) {
  const accentColor =
    accent === "full"
      ? "text-full"
      : accent === "half"
      ? "text-half"
      : accent === "chapati"
      ? "text-chapati"
      : "text-brand";

  return (
    <div className="bg-white/60 rounded-card border border-ink/10 px-4 py-3 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</span>
      <span
        className={cx(
          "font-mono font-semibold text-ink",
          big ? "text-3xl" : "text-xl",
          accent && accentColor
        )}
      >
        {value}
      </span>
    </div>
  );
}
