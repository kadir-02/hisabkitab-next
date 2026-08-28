"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-paper rounded-t-2xl sm:rounded-2xl border border-ink/10 shadow-ledger p-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-ink/5 text-ink-soft tap-scale"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
