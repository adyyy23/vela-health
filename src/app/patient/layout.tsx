import React from "react";
import PatientBottomNav from "@/components/PatientBottomNav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#EDF3F8] text-slate-900 flex justify-center selection:bg-sky-100 selection:text-sky-900">
      {/* Mobile-first centered container: On mobile displays full width 100%, on desktop centers a sleek modern phone-width shell */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#EDF3F8] relative pb-24 shadow-[0_0_50px_rgba(15,23,42,0.06)] md:border-x md:border-slate-200/80">
        <main className="flex-1 flex flex-col">{children}</main>
        <PatientBottomNav />
      </div>
    </div>
  );
}
