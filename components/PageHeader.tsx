import { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 bg-paper/95 backdrop-blur-sm px-5 pt-6 pb-4 border-b border-rule-blue/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-body mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-display font-semibold text-ink leading-tight">{title}</h1>
        </div>
        {action}
      </div>
    </header>
  );
}
