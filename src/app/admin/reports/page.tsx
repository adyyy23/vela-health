"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, Calendar, Building2, CheckCircle2 } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
          Operational Analytics
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
          Capacity & Demand Reports
        </h1>
        <p className="text-xs text-vela-muted mt-1">
          Specialty demand distribution, clinic utilization rates, and scheduling efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilization by Clinic */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8E4] shadow-sm">
          <h3 className="font-bold text-vela-ink text-sm mb-4">Facility Capacity Utilization</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-vela-ink mb-1.5">
                <span>Vela Central Pavilion (Flagship)</span>
                <span className="font-bold text-emerald-800">84% Utilized</span>
              </div>
              <div className="w-full bg-[#EFF2EF] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-700 h-full rounded-full" style={{ width: "84%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-vela-ink mb-1.5">
                <span>Vela Mission Bay Health Hub</span>
                <span className="font-bold text-vela-forest">72% Utilized</span>
              </div>
              <div className="w-full bg-[#EFF2EF] h-2 rounded-full overflow-hidden">
                <div className="bg-vela-sage h-full rounded-full" style={{ width: "72%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-vela-ink mb-1.5">
                <span>Vela Marina Wellness Studio</span>
                <span className="font-bold text-vela-forest">65% Utilized</span>
              </div>
              <div className="w-full bg-[#EFF2EF] h-2 rounded-full overflow-hidden">
                <div className="bg-vela-sage h-full rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-vela-ink mb-1.5">
                <span>Vela Pacific Heights Suite</span>
                <span className="font-bold text-vela-forest">60% Utilized</span>
              </div>
              <div className="w-full bg-[#EFF2EF] h-2 rounded-full overflow-hidden">
                <div className="bg-vela-sage/80 h-full rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist & Flow Efficiency */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8E4] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-vela-ink text-sm mb-4">Patient Throughput Metrics</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F7F9F7] border border-[#E2E8E4] flex items-center justify-between">
                <div>
                  <span className="font-bold text-vela-ink block">Average Wait Time Post Check-In</span>
                  <span className="text-[11px] text-vela-muted">From digital check-in to exam room</span>
                </div>
                <span className="text-base font-extrabold text-emerald-800">6.4 min</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F9F7] border border-[#E2E8E4] flex items-center justify-between">
                <div>
                  <span className="font-bold text-vela-ink block">Digital Check-In Adoption</span>
                  <span className="text-[11px] text-vela-muted">Patients checking in via mobile PWA</span>
                </div>
                <span className="text-base font-extrabold text-vela-forest">91%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F9F7] border border-[#E2E8E4] flex items-center justify-between">
                <div>
                  <span className="font-bold text-vela-ink block">Waitlist Slot Recovery</span>
                  <span className="text-[11px] text-vela-muted">Cancellations successfully refilled</span>
                </div>
                <span className="text-base font-extrabold text-emerald-800">88%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8E4] flex items-center justify-between text-xs text-vela-muted">
            <span>Data refreshed continuously</span>
            <span className="font-bold text-vela-sage">HIPAA Compliant Aggregate Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
