import { cx } from "@/lib/utils";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "h-5 w-5 rounded-full border-2 border-ink/15 border-t-brand animate-spin",
        className
      )}
    />
  );
}
