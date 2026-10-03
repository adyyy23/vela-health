import React from "react";
import DoctorHeaderNav from "@/components/DoctorHeaderNav";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-vela-canvas text-vela-ink flex flex-col font-sans">
      <DoctorHeaderNav />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
