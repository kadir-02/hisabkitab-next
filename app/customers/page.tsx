"use client";

import { useEffect, useState } from "react";
import { CustomersApi } from "@/lib/api-client";
import { Customer } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import CustomerFormModal from "@/components/CustomerFormModal";
import { Plus, Phone, Users2 } from "lucide-react";
import { cx } from "@/lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  function load() {
    setLoading(true);
    CustomersApi.list()
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSave(data: { name: string; phone: string }) {
    if (editing) {
      const updated = await CustomersApi.update(editing.id, data);
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await CustomersApi.create(data);
      setCustomers((prev) => [...prev, created]);
    }
    setModalOpen(false);
    setEditing(null);
  }

  async function toggleActive(customer: Customer) {
    const updated = await CustomersApi.update(customer.id, { is_active: !customer.is_active });
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  const active = customers.filter((c) => c.is_active);
  const inactive = customers.filter((c) => !c.is_active);

  return (
    <div className="ledger-page min-h-full">
      <PageHeader
        eyebrow="Tiffin holders"
        title="Customers"
        action={
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="tap-scale flex items-center gap-1 bg-brand text-white text-xs font-semibold rounded-full pl-2.5 pr-3 py-2"
          >
            <Plus size={15} /> Add
          </button>
        }
      />

      <div className="px-5 py-4">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-brand-dark bg-brand/10 rounded-lg px-3 py-2 mb-3">{error}</p>
        )}

        {!loading && customers.length === 0 && (
          <EmptyState
            icon={<Users2 size={28} className="text-ink-faint" />}
            title="No customers yet"
            description="Add your first tiffin holder to get started."
          />
        )}

        {!loading && active.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[11px] uppercase tracking-wide text-ink-faint font-semibold mb-2">
              Active · {active.length}
            </h2>
            <div className="flex flex-col gap-2">
              {active.map((c) => (
                <CustomerCard key={c.id} customer={c} onEdit={() => { setEditing(c); setModalOpen(true); }} onToggle={() => toggleActive(c)} />
              ))}
            </div>
          </section>
        )}

        {!loading && inactive.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-wide text-ink-faint font-semibold mb-2">
              Inactive · {inactive.length}
            </h2>
            <div className="flex flex-col gap-2">
              {inactive.map((c) => (
                <CustomerCard key={c.id} customer={c} onEdit={() => { setEditing(c); setModalOpen(true); }} onToggle={() => toggleActive(c)} />
              ))}
            </div>
          </section>
        )}
      </div>

      {modalOpen && (
        <CustomerFormModal
          customer={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function CustomerCard({
  customer,
  onEdit,
  onToggle,
}: {
  customer: Customer;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white/50 rounded-card border border-ink/10 px-4 py-3 flex items-center justify-between">
      <button onClick={onEdit} className="text-left flex-1">
        <p className="font-display font-semibold text-ink text-[15px]">{customer.name}</p>
        {customer.phone && (
          <p className="text-[11px] text-ink-faint flex items-center gap-1 mt-0.5">
            <Phone size={11} /> {customer.phone}
          </p>
        )}
      </button>
      <button
        onClick={onToggle}
        className={cx(
          "tap-scale text-[11px] font-semibold rounded-full px-3 py-1.5 border",
          customer.is_active
            ? "bg-half-soft text-half border-half/40"
            : "bg-steel-soft text-steel border-steel/40"
        )}
      >
        {customer.is_active ? "Active" : "Inactive"}
      </button>
    </div>
  );
}
