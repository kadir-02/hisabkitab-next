export type Meal = "LUNCH" | "DINNER";
export type TiffinCode = "FULL" | "HALF" | "CHAPATI";

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TiffinType {
  id: string;
  name: string;
  code: TiffinCode;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  meal: Meal;
  tiffin_type_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface DailyBreakdown {
  date: string;
  day: string;
  lunch: number;
  dinner: number;
}

export interface TypeBreakdown {
  FULL: number;
  HALF: number;
  CHAPATI: number;
}

export interface CustomerSummary {
  customer_id: string;
  name: string;
  full: number;
  half: number;
  chapati: number;
  total: number;
  amount: number;
}

export interface ReportSummary {
  from: string;
  to: string;
  total_tiffins: number;
  total_amount: number;
  by_type: TypeBreakdown;
  daily: DailyBreakdown[];
  customers: CustomerSummary[];
}

export interface CustomerReportEntry {
  id: string;
  date: string;
  meal: Meal;
  tiffin_type: string;
  code: TiffinCode;
  quantity: number;
  price: number;
}

export interface CustomerReport {
  customer: Customer;
  from: string;
  to: string;
  entries: CustomerReportEntry[];
  totals: {
    full: number;
    half: number;
    chapati: number;
    total: number;
    amount: number;
  };
}

export interface DashboardData {
  from: string;
  to: string;
  total_tiffins: number;
  total_amount: number;
  by_type: TypeBreakdown;
  active_customers: number;
  recent_days: DailyBreakdown[];
}
