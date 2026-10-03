import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileGuard from "@/components/AdminMobileGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminMobileGuard>
      <div className="flex w-full min-h-screen bg-vela-canvas font-sans text-vela-ink">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-vela-canvas">
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8E4] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-vela-ink uppercase tracking-wider">
                Network Operations Live • 4 Clinics Synchronized
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-vela-muted">
              <span>Pacific Time (SF)</span>
              <span>•</span>
              <span className="font-mono font-semibold text-vela-ink">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminMobileGuard>
  );
}
