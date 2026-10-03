"use client";

import React, { useState, useEffect } from "react";
import { Appointment } from "@/types";
import { Search, CalendarCheck, Filter, Download, MoreHorizontal, CheckCircle2 } from "lucide-react";

export default function AdminAppointmentsPage() {
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
      const term = search.toLowerCase();
      const match =
        (a.patientName || "").toLowerCase().includes(term) ||
        (a.doctorName || "").toLowerCase().includes(term) ||
        (a.referenceNo || "").toLowerCase().includes(term) ||
        (a.clinicName || "").toLowerCase().includes(term);
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
              Central Master Schedule
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Appointment Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit, reschedule, and supervise bookings across all network clinicians.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="">All Statuses</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="REQUESTED">Requested</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, physician, clinic, or ref #..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-bubble border border-slate-200/90 shadow-bubble overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Ref #</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Physician & Specialty</th>
                <th className="px-5 py-3.5">Facility</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{a.referenceNo}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{a.patientName}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-900 block">{a.doctorName}</span>
                    <span className="text-[10px] text-sky-600">{a.doctorSpecialty}</span>
                  </td>
                  <td className="px-5 py-3.5">{a.clinicName}</td>
                  <td className="px-5 py-3.5 font-medium">
                    {a.scheduledDate} {a.scheduledTime}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {a.consultationType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        a.status === "CHECKED_IN"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : a.status === "COMPLETED"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}
                    >
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
