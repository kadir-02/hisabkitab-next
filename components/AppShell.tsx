"use client";

import BottomNav from "./BottomNav";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-[#e9e1c8] flex items-start justify-center sm:py-8">
      <div
        className="
          relative
          w-full
          h-screen
          sm:max-w-md
          sm:h-[calc(100vh-4rem)]
          sm:rounded-[26px]
          sm:overflow-hidden
          sm:shadow-ledger
          bg-[#3a2c22]
          sm:border-[6px]
          border-[#2b2118]
        "
      >
        {/* Spine */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-4 notebook-spine bg-[#2b2118]" />

        {/* Actual app viewport */}
        <div className="absolute inset-0 flex flex-col bg-paper sm:pl-4">
          
          {/* SCROLLING CONTENT ONLY */}
          <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar">
            <div className="pb-24">
              {children}
            </div>
          </main>

          {/* FIXED APP NAV */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
