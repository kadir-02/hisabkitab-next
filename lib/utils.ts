const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Parse a YYYY-MM-DD string into a local Date (avoids UTC-shift bugs). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, delta: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + delta);
  return toISODate(d);
}

export function dayShort(iso: string): string {
  return DAY_NAMES[parseISODate(iso).getDay()];
}

export function dayFull(iso: string): string {
  return DAY_NAMES_FULL[parseISODate(iso).getDay()];
}

export function formatDisplayDate(iso: string): string {
  const d = parseISODate(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export function isToday(iso: string): boolean {
  return iso === todayISO();
}

export function startOfMonthISO(iso: string = todayISO()): string {
  const d = parseISODate(iso);
  return toISODate(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function startOfWeekISO(iso: string = todayISO()): string {
  const d = parseISODate(iso);
  const day = d.getDay();
  return addDays(toISODate(d), -day);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cx(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(" ");
}
