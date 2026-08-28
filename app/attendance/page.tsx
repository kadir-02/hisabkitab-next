"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AttendanceApi,
  CustomersApi,
  TiffinTypesApi,
  ApiError,
} from "@/lib/api-client";
import { Attendance, Customer, Meal, TiffinType } from "@/lib/types";
import { formatCurrency, todayISO } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import DateNav from "@/components/DateNav";
import CustomerAttendanceRow from "@/components/CustomerAttendanceRow";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { UtensilsCrossed } from "lucide-react";

function key(userId: string, meal: Meal) {
  return `${userId}|${meal}`;
}

export default function AttendancePage() {
  const [date, setDate] = useState(todayISO());
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [types, setTypes] = useState<TiffinType[]>([]);
  const [records, setRecords] = useState<Map<string, Attendance>>(new Map());
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load customers + tiffin types once.
  useEffect(() => {
    Promise.all([CustomersApi.list(true), TiffinTypesApi.list()])
      .then(([c, t]) => {
        setCustomers(c);
        setTypes(t);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Load attendance whenever the date changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    AttendanceApi.list({ date })
      .then((rows) => {
        if (cancelled) return;
        const map = new Map<string, Attendance>();
        rows.forEach((r) => map.set(key(r.user_id, r.meal), r));
        setRecords(map);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  const { totalTiffins, totalAmount } = useMemo(() => {
    let tiffins = 0;
    let amount = 0;
    records.forEach((r) => {
      tiffins += r.quantity;
      amount += r.price * r.quantity;
    });
    return { totalTiffins: tiffins, totalAmount: amount };
  }, [records]);

  async function handleSelect(
    customerId: string,
    meal: Meal,
    typeId: string | null,
  ) {
    const k = key(customerId, meal);
    const existing = records.get(k);
    setError(null);
    setBusyKey(k);

    try {
      if (typeId === null) {
        if (existing) {
          await AttendanceApi.remove(existing.id);
          setRecords((prev) => {
            const next = new Map(prev);
            next.delete(k);
            return next;
          });
        }
      } else if (!existing) {
        const created = await AttendanceApi.create({
          user_id: customerId,
          date,
          meal,
          tiffin_type_id: typeId,
        });
        setRecords((prev) => new Map(prev).set(k, created));
      } else if (existing.tiffin_type_id !== typeId) {
        const updated = await AttendanceApi.update(existing.id, {
          tiffin_type_id: typeId,
        });
        setRecords((prev) => new Map(prev).set(k, updated));
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not save. Try again.",
      );
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="ledger-page min-h-full">
      <PageHeader eyebrow="Mark today's" title="Attendance" />

      <div className="px-5 pt-4 pb-3">
        <DateNav date={date} onChange={setDate} />
      </div>

      {error && (
        <div className="mx-5 mb-3 text-sm text-brand-dark bg-brand/10 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed size={28} className="text-ink-faint" />}
          title="No customers yet"
          description="Add a customer from the Customers tab to start marking attendance."
        />
      ) : (
        <div className="px-5 pb-6 flex flex-col gap-3">
          {customers.map((customer) => (
            <CustomerAttendanceRow
              key={customer.id}
              customer={customer}
              types={types}
              lunchTypeId={
                records.get(key(customer.id, "LUNCH"))?.tiffin_type_id || null
              }
              dinnerTypeId={
                records.get(key(customer.id, "DINNER"))?.tiffin_type_id || null
              }
              onSelectLunch={(typeId) =>
                handleSelect(customer.id, "LUNCH", typeId)
              }
              onSelectDinner={(typeId) =>
                handleSelect(customer.id, "DINNER", typeId)
              }
              busy={
                busyKey === key(customer.id, "LUNCH") ||
                busyKey === key(customer.id, "DINNER")
              }
            />
          ))}
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="mx-5 mb-4 bg-ink text-paper rounded-card px-4 py-3 flex items-center justify-between shadow-ledger">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-paper/60">
              Day total
            </p>
            <p className="font-mono font-semibold">{totalTiffins} tiffins</p>
          </div>

          <p className="font-mono font-bold text-lg">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      )}
    </div>
  );
}
