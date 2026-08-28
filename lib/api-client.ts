import {
  Attendance,
  Customer,
  CustomerReport,
  DashboardData,
  Meal,
  ReportSummary,
  TiffinCode,
  TiffinType,
} from "./types";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body?.error || "Something went wrong.", res.status);
  }
  return body.data as T;
}

function qs(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries as [string, string][]).toString();
}

// ---------- Customers ----------
export const CustomersApi = {
  list: (activeOnly?: boolean) =>
    request<Customer[]>(`/api/customers${qs({ active: activeOnly ? "true" : undefined })}`),
  get: (id: string) => request<Customer>(`/api/customers/${id}`),
  create: (data: { name: string; phone?: string }) =>
    request<Customer>(`/api/customers`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Pick<Customer, "name" | "phone" | "is_active">>) =>
    request<Customer>(`/api/customers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ---------- Tiffin types ----------
export const TiffinTypesApi = {
  list: () => request<TiffinType[]>(`/api/tiffin-types`),
  update: (id: string, data: Partial<Pick<TiffinType, "price" | "name" | "is_active">>) =>
    request<TiffinType>(`/api/tiffin-types/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ---------- Attendance ----------
export const AttendanceApi = {
  list: (params: { date?: string; from?: string; to?: string; user_id?: string; meal?: Meal }) =>
    request<Attendance[]>(`/api/attendance${qs(params)}`),
  create: (data: { user_id: string; date: string; meal: Meal; tiffin_type_id: string; quantity?: number }) =>
    request<Attendance>(`/api/attendance`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Pick<Attendance, "tiffin_type_id" | "quantity">>) =>
    request<Attendance>(`/api/attendance/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) => request<{ id: string; deleted: boolean }>(`/api/attendance/${id}`, { method: "DELETE" }),
};

// ---------- Reports ----------
export const ReportsApi = {
  summary: (from: string, to: string) => request<ReportSummary>(`/api/reports/summary${qs({ from, to })}`),
  customer: (customerId: string, from: string, to: string) =>
    request<CustomerReport>(`/api/reports/customer/${customerId}${qs({ from, to })}`),
};

// ---------- Dashboard ----------
export const DashboardApi = {
  get: (from?: string, to?: string) => request<DashboardData>(`/api/dashboard${qs({ from, to })}`),
};

export type { TiffinCode };
export { ApiError };
