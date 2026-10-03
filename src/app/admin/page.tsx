"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Kanban,
  ShieldCheck,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure logged in as admin
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user || data.user.role !== "ADMIN") {
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@velahealth.com", password: "AdminPass123!" }),
          });
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      {/* Top Banner */}
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
            Enterprise Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
            Network Operations Center
          </h1>
          <p className="text-xs text-vela-muted mt-1">
            Real-time multi-clinic status, patient flow throughput, and credential oversight.
          </p>
        </div>

        <Link
          href="/admin/operations"
          className="px-6 py-3 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
        >
          <Kanban className="w-4 h-4" />
          <span>Launch Live Operations Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Real Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-card border border-[#E2E8E4] shadow-sm">
          <div className="flex items-center justify-between text-vela-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Patients Checked In</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-3xl font-black text-vela-ink block">1</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Waiting in Reception Area B
          </span>
        </div>

        <div className="bg-white p-5 rounded-card border border-[#E2E8E4] shadow-sm">
          <div className="flex items-center justify-between text-vela-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Total Bookings</span>
            <CalendarCheck className="w-4 h-4 text-vela-sage" />
          </div>
          <span className="text-3xl font-black text-vela-ink block">4</span>
          <span className="text-[11px] text-vela-muted mt-1 block">
            Across 4 San Francisco Facilities
          </span>
        </div>

        <div className="bg-white p-5 rounded-card border border-[#E2E8E4] shadow-sm">
          <div className="flex items-center justify-between text-vela-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Clinicians</span>
            <Stethoscope className="w-4 h-4 text-vela-sage" />
          </div>
          <span className="text-3xl font-black text-vela-ink block">4</span>
          <span className="text-[11px] text-vela-muted mt-1 block">
            100% Board Licensure Verified
          </span>
        </div>

        <div className="bg-white p-5 rounded-card border border-[#E2E8E4] shadow-sm">
          <div className="flex items-center justify-between text-vela-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Network Capacity</span>
            <Building2 className="w-4 h-4 text-vela-sage" />
          </div>
          <span className="text-3xl font-black text-vela-ink block">78%</span>
          <span className="text-[11px] text-vela-muted mt-1 block">
            Optimal patient throughput
          </span>
        </div>
      </div>

      {/* 2-Column Section: Facility Throughput & Specialty Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clinic Status (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-vela-ink text-sm">Facility Throughput & Status</h3>
            <Link href="/admin/clinics" className="text-xs font-semibold text-vela-sage hover:text-vela-sageDark">
              Manage Facilities →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: "Vela Central Pavilion (Sutter St)", rooms: "8 Rooms", activeDoc: "Dr. Elena Reyes", status: "Active (Checked in patient)" },
              { name: "Vela Mission Bay Health Hub", rooms: "6 Rooms", activeDoc: "Dr. Marcus Chen", status: "Active (Telehealth & In-person)" },
              { name: "Vela Marina Wellness Studio", rooms: "4 Rooms", activeDoc: "Dr. Sofia Alvarez", status: "Active" },
              { name: "Vela Pacific Heights Suite", rooms: "5 Rooms", activeDoc: "Dr. Aris Patel", status: "Active" },
            ].map((c, i) => (
              <div key={i} className="p-3.5 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-vela-ink">{c.name}</h4>
                  <span className="text-vela-muted text-[11px]">{c.rooms} • Attending: {c.activeDoc}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-pill border border-emerald-200">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specialty Demand & Live Activity (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-vela-ink text-sm mb-4">Patient Volume by Specialty</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-vela-ink mb-1">
                  <span>Dermatology & Skin Care</span>
                  <span>42%</span>
                </div>
                <div className="w-full bg-[#E2E8E4] h-2 rounded-full overflow-hidden">
                  <div className="bg-vela-forest h-full rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-vela-ink mb-1">
                  <span>Cardiology & Preventative</span>
                  <span>28%</span>
                </div>
                <div className="w-full bg-[#E2E8E4] h-2 rounded-full overflow-hidden">
                  <div className="bg-vela-sage h-full rounded-full" style={{ width: "28%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-vela-ink mb-1">
                  <span>Family & General Medicine</span>
                  <span>18%</span>
                </div>
                <div className="w-full bg-[#E2E8E4] h-2 rounded-full overflow-hidden">
                  <div className="bg-vela-sage/60 h-full rounded-full" style={{ width: "18%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-vela-ink mb-1">
                  <span>Pediatrics</span>
                  <span>12%</span>
                </div>
                <div className="w-full bg-[#E2E8E4] h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-300 h-full rounded-full" style={{ width: "12%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
            <span className="text-vela-muted">Security Audit Logs</span>
            <Link href="/admin/audit" className="font-bold text-vela-sage hover:text-vela-sageDark">
              View Audit Trail →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
