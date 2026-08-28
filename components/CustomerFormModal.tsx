"use client";

import { useState } from "react";
import { Customer } from "@/lib/types";
import Modal from "./Modal";

export default function CustomerFormModal({
  customer,
  onClose,
  onSave,
}: {
  customer?: Customer | null;
  onClose: () => void;
  onSave: (data: { name: string; phone: string }) => Promise<void>;
}) {
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({ name: name.trim(), phone: phone.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={customer ? "Edit customer" : "Add customer"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-ink-faint">Name *</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-ink-faint">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            inputMode="tel"
            className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
          />
        </label>

        {error && <p className="text-xs text-brand-dark bg-brand/10 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="tap-scale mt-1 bg-brand text-white font-semibold text-sm rounded-lg py-2.5 disabled:opacity-60"
        >
          {saving ? "Saving…" : customer ? "Save changes" : "Save customer"}
        </button>
      </form>
    </Modal>
  );
}
