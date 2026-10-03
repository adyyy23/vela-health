"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import VelaLogo from "./VelaLogo";
import {
  Clock,
  Calendar,
  Users,
  MessageSquare,
  Sliders,
  User,
  LogOut,
  Stethoscope,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function DoctorHeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inClinicStatus, setInClinicStatus] = useState<"ACTIVE" | "BREAK">("ACTIVE");

  const links = [
    { href: "/doctor", label: "Today", icon: Clock, exact: true },
    { href: "/doctor/schedule", label: "Schedule", icon: Calendar, exact: false },
    { href: "/doctor/appointments", label: "Appointments", icon: Stethoscope, exact: false },
    { href: "/doctor/patients", label: "Patients", icon: Users, exact: false },
    { href: "/doctor/messages", label: "Messages", icon: MessageSquare, exact: false },
    { href: "/doctor/availability", label: "Availability", icon: Sliders, exact: false },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand + Clinician Portal Badge */}
        <div className="flex items-center gap-4">
          <Link href="/doctor">
            <VelaLogo size="sm" />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full border border-sky-100">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinician Portal</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
          {links.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Status toggle, alerts, profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status pill */}
          <button
            onClick={() => setInClinicStatus(inClinicStatus === "ACTIVE" ? "BREAK" : "ACTIVE")}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
              inClinicStatus === "ACTIVE"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                inClinicStatus === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{inClinicStatus === "ACTIVE" ? "In Clinic (Ready)" : "On Break"}</span>
          </button>

          {/* Profile & Logout */}
          <Link
            href="/doctor/profile"
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"
              alt="Dr. Elena Reyes"
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <span className="hidden md:inline text-xs font-semibold text-slate-800">
              Dr. Reyes
            </span>
          </Link>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? "bg-sky-50 text-sky-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
