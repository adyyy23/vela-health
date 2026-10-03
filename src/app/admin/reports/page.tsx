"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, Calendar, Building2, CheckCircle2 } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
          Operational Analytics
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Capacity & Demand Reports
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Specialty demand distribution, clinic utilization rates, and scheduling efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilization by Clinic */}
        <div className="bg-white rounded-bubble p-6 border border-slate-200/90 shadow-bubble">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Facility Capacity Utilization</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Vela Central Pavilion (Flagship)</span>
                <span className="font-bold text-emerald-600">84% Utilized</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "84%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Vela Mission Bay Health Hub</span>
                <span className="font-bold text-sky-600">72% Utilized</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: "72%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Vela Marina Wellness Studio</span>
                <span className="font-bold text-sky-600">65% Utilized</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Vela Pacific Heights Suite</span>
                <span className="font-bold text-sky-600">60% Utilized</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist & Flow Efficiency */}
        <div className="bg-white rounded-bubble p-6 border border-slate-200/90 shadow-bubble flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-4">Patient Throughput Metrics</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Average Wait Time Post Check-In</span>
                  <span className="text-[11px] text-slate-500">From digital check-in to exam room</span>
                </div>
                <span className="text-base font-extrabold text-emerald-600">6.4 min</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Digital Check-In Adoption</span>
                  <span className="text-[11px] text-slate-500">Patients checking in via mobile PWA</span>
                </div>
                <span className="text-base font-extrabold text-sky-600">91%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Waitlist Slot Recovery</span>
                  <span className="text-[11px] text-slate-500">Cancellations successfully refilled</span>
                </div>
                <span className="text-base font-extrabold text-emerald-600">88%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Data refreshed continuously</span>
            <span className="font-bold text-sky-600">HIPAA Compliant Aggregate Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
