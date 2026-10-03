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
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
              Physician Calendar & Ledger
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Appointments
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage patient consultations, launch clinical workspaces, and review past encounter notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
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
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Patient"
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{apt.patientName}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      apt.status === "CHECKED_IN"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : apt.status === "COMPLETED"
                        ? "bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-sky-50 text-sky-700 border-sky-200"
                    }`}
                  >
                    {apt.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{apt.reason}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
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
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-end sm:self-center"
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
