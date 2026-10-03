"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Appointment } from "@/types";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  FileEdit,
  Video,
  Building2,
} from "lucide-react";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
        setLoading(false);
      });
  }, []);

  const filtered = appointments.filter((a) => {
    if (statusFilter && a.status !== statusFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      const match = (a.patientName?.toLowerCase() || "").includes(s) || (a.referenceNo || "").toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
              Physician Calendar & Ledger
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
              Clinical Appointments
            </h1>
            <p className="text-xs text-vela-muted mt-1">
              Manage patient consultations, launch clinical workspaces, and review past encounter notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-semibold text-vela-ink"
            >
              <option value="">All Statuses</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-card p-5 border border-[#E2E8E4] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-vela-sage/30 transition"
          >
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Patient"
                className="w-12 h-12 rounded-xl object-cover border border-[#E2E8E4] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-vela-ink">{apt.patientName}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-pill border ${
                      apt.status === "CHECKED_IN"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : apt.status === "COMPLETED"
                        ? "bg-vela-surfaceSubtle text-vela-muted border-[#E2E8E4]"
                        : "bg-[#EAF0EC] text-vela-forest border-vela-sage/30"
                    }`}
                  >
                    {apt.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-vela-muted mt-0.5">{apt.reason}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-vela-muted">
                  <span className="font-bold text-vela-ink flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-vela-muted" />
                    <span>{apt.scheduledDate} at {apt.scheduledTime}</span>
                  </span>
                  <span>•</span>
                  <span>{apt.consultationType === "TELEHEALTH" ? "Telehealth" : "In-Person"}</span>
                  <span>•</span>
                  <span>Ref #{apt.referenceNo}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/doctor/workspace/${apt.id}`}
              className="px-4 py-2.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-end sm:self-center"
            >
              <FileEdit className="w-4 h-4" />
              <span>Clinical Workspace</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
