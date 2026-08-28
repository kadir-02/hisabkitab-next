import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "HisabKitab · Tiffin Ledger",
  description: "Track tiffin attendance, pricing and monthly billing — the bahi-khata way.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f7f1df",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
