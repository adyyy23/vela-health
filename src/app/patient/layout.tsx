import React from "react";
import PatientBottomNav from "@/components/PatientBottomNav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-vela-canvas text-vela-ink flex justify-center selection:bg-vela-surfaceSubtle selection:text-vela-forest">
      {/* Mobile-first centered container: On mobile displays full width 100%, on desktop centers a sleek modern phone-width shell */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-vela-canvas relative pb-24 shadow-[0_0_50px_rgba(20,34,28,0.06)] md:border-x md:border-[#E2E8E4]">
        <main className="flex-1 flex flex-col">{children}</main>
        <PatientBottomNav />
      </div>
    </div>
  );
}
