"use client";

import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-[#e9e1c8] flex items-start justify-center sm:py-8">
      <div className="relative w-full sm:max-w-md sm:h-[calc(100vh-4rem)] sm:rounded-[26px] sm:overflow-hidden sm:shadow-ledger bg-[#3a2c22] sm:border-[6px] border-[#2b2118] h-screen flex">
        {/* Spine / binding */}
        <div className="hidden sm:block w-4 notebook-spine bg-[#2b2118]" />

        <div className="flex-1 flex flex-col min-h-0 bg-paper relative">
          {/* Only this area scrolls */}
          <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-24">
            {children}
          </main>

          {/* Always fixed at the bottom of the app shell */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
