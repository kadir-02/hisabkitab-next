"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ClipboardCheck,
  Users,
  Tags,
  FileBarChart2,
} from "lucide-react";
import { cx } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/pricing", label: "Pricing", icon: Tags },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 bg-[#f1e8cf] border-t-2 border-[#2b2118]/15 shadow-[0_-4px_12px_-6px_rgba(43,33,24,0.25)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center justify-center gap-1 py-2.5 tap-scale"
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? "text-brand" : "text-ink-faint"}
                />

                <span
                  className={cx(
                    "text-[10px] font-body tracking-wide",
                    active ? "text-brand font-semibold" : "text-ink-faint",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="pb-1.5 text-center">
        <span className="text-[8px] font-body tracking-wider text-ink-faint/70">
          Developed by Kadir
        </span>
      </div>
    </nav>
  );
}
