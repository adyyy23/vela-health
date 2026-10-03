"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserCheck, Stethoscope, Shield, Globe, RefreshCw, Smartphone, Monitor } from "lucide-react";

export default function RoleDemoToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const switchAccount = async (email: string, password: string, targetPath: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(targetPath);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      aria-label="Role Switcher"
      className="fixed bottom-4 left-4 z-[999] font-sans transition-all duration-300 pointer-events-auto"
    >
      <div
        className={`bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-200 ${
          collapsed ? "p-2" : "p-3 sm:px-4"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide text-slate-200">
              Demo Environment & Role Switcher
            </span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[11px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
          >
            {collapsed ? "Expand" : "Minimize"}
          </button>
        </div>

        {!collapsed && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => logout()}
              disabled={loading}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition ${
                pathname === "/" || pathname.startsWith("/find-care") || pathname.startsWith("/doctors")
                  ? "bg-sky-600 text-white font-medium"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Guest</span>
            </button>

            <button
              onClick={() => switchAccount("patient@velahealth.com", "PatientPass123!", "/patient")}
              disabled={loading}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition ${
                pathname.startsWith("/patient")
                  ? "bg-sky-600 text-white font-medium"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Patient (Maria)</span>
            </button>

            <button
              onClick={() => switchAccount("doctor.reyes@velahealth.com", "DoctorPass123!", "/doctor")}
              disabled={loading}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition ${
                pathname.startsWith("/doctor")
                  ? "bg-sky-600 text-white font-medium"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
              <span>Doctor (Dr. Reyes)</span>
            </button>

            <button
              onClick={() => switchAccount("admin@velahealth.com", "AdminPass123!", "/admin")}
              disabled={loading}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition ${
                pathname.startsWith("/admin")
                  ? "bg-sky-600 text-white font-medium"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin (Ops Board)</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
