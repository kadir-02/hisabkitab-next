import { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-14 px-6 text-ink-faint">
      {icon}
      <p className="font-display font-semibold text-ink text-base">{title}</p>
      {description && <p className="text-xs max-w-[26ch]">{description}</p>}
    </div>
  );
}
