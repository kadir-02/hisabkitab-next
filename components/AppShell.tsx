"use client";

import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#e9e1c8] flex items-start justify-center sm:py-8">
      <div className="relative w-full sm:max-w-md sm:rounded-[26px] sm:overflow-hidden sm:shadow-ledger bg-[#3a2c22] sm:border-[6px] border-[#2b2118] min-h-screen sm:min-h-[calc(100vh-4rem)] flex">
        {/* Spine / binding */}
        <div className="hidden sm:block w-4 notebook-spine bg-[#2b2118]" />
        <div className="flex-1 flex flex-col min-h-screen sm:min-h-[calc(100vh-4rem)] bg-paper relative">
          <main className="flex-1 overflow-y-auto no-scrollbar pb-24">{children}</main>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
