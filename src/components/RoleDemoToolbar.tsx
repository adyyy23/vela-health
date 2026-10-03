"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserCheck, Stethoscope, Shield, Globe, ChevronUp, ChevronDown } from "lucide-react";

export default function RoleDemoToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // Default collapsed to stay unobtrusive

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

  const currentRole = pathname.startsWith("/patient")
    ? "Patient (Maria)"
    : pathname.startsWith("/doctor")
    ? "Doctor (Dr. Reyes)"
    : pathname.startsWith("/admin")
    ? "Admin (Ops)"
    : "Public Guest";

  return (
    <aside
      aria-label="Demo Role Switcher"
      className="fixed bottom-3 right-3 z-[999] font-sans pointer-events-auto select-none"
    >
      <div className="bg-[#17231D]/95 backdrop-blur-md text-white border border-slate-700/60 rounded-xl shadow-xl transition-all duration-200">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold hover:text-emerald-200 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Role:</span>
            <span className="text-white font-bold">{currentRole}</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>
        ) : (
          <div className="p-3 max-w-sm">
            <div className="flex items-center justify-between gap-3 mb-2 border-b border-slate-700/60 pb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Switch Demo Role</span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 flex items-center gap-0.5"
              >
                <span>Close</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => logout()}
                disabled={loading}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition text-left ${
                  pathname === "/" || pathname.startsWith("/find-care") || pathname.startsWith("/doctors") || pathname.startsWith("/clinics") || pathname.startsWith("/services") || pathname.startsWith("/telehealth") || pathname.startsWith("/care-finder")
                    ? "bg-[#526A5B] text-white font-semibold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Globe className="w-3.5 h-3.5 shrink-0 text-slate-300" />
                <span className="truncate">Public Guest</span>
              </button>

              <button
                onClick={() => switchAccount("patient@velahealth.com", "PatientPass123!", "/patient")}
                disabled={loading}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition text-left ${
                  pathname.startsWith("/patient")
                    ? "bg-[#526A5B] text-white font-semibold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span className="truncate">Patient (Maria)</span>
              </button>

              <button
                onClick={() => switchAccount("doctor.reyes@velahealth.com", "DoctorPass123!", "/doctor")}
                disabled={loading}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition text-left ${
                  pathname.startsWith("/doctor")
                    ? "bg-[#526A5B] text-white font-semibold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
                <span className="truncate">Doctor (Reyes)</span>
              </button>

              <button
                onClick={() => switchAccount("admin@velahealth.com", "AdminPass123!", "/admin")}
                disabled={loading}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition text-left ${
                  pathname.startsWith("/admin")
                    ? "bg-[#526A5B] text-white font-semibold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Shield className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="truncate">Admin (NOC)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
