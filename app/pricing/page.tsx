"use client";

import { useEffect, useState } from "react";
import { TiffinTypesApi } from "@/lib/api-client";
import { TiffinType } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import Spinner from "@/components/Spinner";
import { formatCurrency, cx } from "@/lib/utils";
import { Check, IndianRupee } from "lucide-react";

const ACCENT: Record<string, string> = {
  FULL: "border-l-full",
  HALF: "border-l-half",
  CHAPATI: "border-l-chapati",
};

export default function PricingPage() {
  const [types, setTypes] = useState<TiffinType[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    TiffinTypesApi.list()
      .then((data) => {
        setTypes(data);
        setDrafts(Object.fromEntries(data.map((t) => [t.id, String(t.price)])));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(type: TiffinType) {
    const value = Number(drafts[type.id]);
    if (Number.isNaN(value) || value < 0) {
      setError("Enter a valid price.");
      return;
    }
    setError(null);
    setSavingId(type.id);
    try {
      const updated = await TiffinTypesApi.update(type.id, { price: value });
      setTypes((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSavedId(type.id);
      setTimeout(() => setSavedId(null), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save price.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="ledger-page min-h-full">
      <PageHeader eyebrow="Rate card" title="Tiffin Prices" />

      <div className="px-5 py-4">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-brand-dark bg-brand/10 rounded-lg px-3 py-2 mb-3">{error}</p>
        )}

        <div className="flex flex-col gap-3">
          {types.map((type) => {
            const dirty = drafts[type.id] !== String(type.price);
            return (
              <div
                key={type.id}
                className={cx(
                  "bg-white/50 rounded-card border border-ink/10 border-l-4 px-4 py-3.5",
                  ACCENT[type.code]
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-display font-semibold text-ink">{type.name}</p>
                    <p className="text-[11px] text-ink-faint font-mono">{formatCurrency(type.price)} · current</p>
                  </div>
                  {savedId === type.id && (
                    <span className="flex items-center gap-1 text-half text-xs font-semibold">
                      <Check size={14} /> Saved
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center gap-1.5 rounded-lg border border-ink/15 bg-white/70 px-3 py-2">
                    <IndianRupee size={14} className="text-ink-faint" />
                    <input
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={drafts[type.id] ?? ""}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [type.id]: e.target.value }))}
                      className="w-full bg-transparent text-sm font-mono text-ink outline-none"
                    />
                  </label>
                  <button
                    disabled={!dirty || savingId === type.id}
                    onClick={() => handleSave(type)}
                    className="tap-scale bg-brand text-white text-xs font-semibold rounded-lg px-4 py-2.5 disabled:opacity-40"
                  >
                    {savingId === type.id ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-ink-faint mt-4 leading-relaxed">
          Changing a price here only affects new attendance marked from today onward — past entries
          keep the price recorded at the time, so old bills stay accurate.
        </p>
      </div>
    </div>
  );
}
