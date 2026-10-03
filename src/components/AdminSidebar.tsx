"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import VelaLogo from "./VelaLogo";
import {
  LayoutDashboard,
  Kanban,
  CalendarCheck,
  Stethoscope,
  Building2,
  Users,
  ShieldCheck,
  BarChart3,
  LogOut,
  Sliders,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuSections = [
    {
      title: "OPERATIONS",
      items: [
        { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
        { href: "/admin/operations", label: "Operations Board", icon: Kanban, exact: false, highlight: true },
        { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck, exact: false },
      ],
    },
    {
      title: "DIRECTORY & NETWORK",
      items: [
        { href: "/admin/doctors", label: "Doctors & Credentials", icon: Stethoscope, exact: false },
        { href: "/admin/clinics", label: "Clinics & Facilities", icon: Building2, exact: false },
        { href: "/admin/patients", label: "Patient Accounts", icon: Users, exact: false },
      ],
    },
    {
      title: "SECURITY & ANALYTICS",
      items: [
        { href: "/admin/audit", label: "Audit Log & Access", icon: ShieldCheck, exact: false },
        { href: "/admin/reports", label: "Capacity & Demand", icon: BarChart3, exact: false },
      ],
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800 shrink-0 select-none">
      <div className="p-5">
        {/* Brand */}
        <div className="pb-6 border-b border-slate-800">
          <VelaLogo size="md" inverted />
          <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 text-sky-400 text-[11px] font-semibold rounded-lg w-max border border-slate-700/60">
            <span>Operations Console</span>
          </div>
        </div>

        {/* Menu list */}
        <div className="mt-6 flex flex-col gap-6">
          {menuSections.map((sec) => (
            <div key={sec.title}>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3">
                {sec.title}
              </span>
              <div className="mt-2 flex flex-col gap-1">
                {sec.items.map((item) => {
                  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? "bg-sky-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                      {item.highlight && (
                        <span className="ml-auto text-[9px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Live
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin User Profile footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
            alt="Sarah Jenkins"
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">Sarah Jenkins</span>
            <span className="text-[10px] text-slate-400">Operations Director</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
