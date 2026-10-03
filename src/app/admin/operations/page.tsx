"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Appointment } from "@/types";
import {
  Kanban,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function AdminOperationsBoardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedClinicFilter, setSelectedClinicFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBoardData = () => {
    setLoading(true);
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  const filtered = selectedClinicFilter
    ? appointments.filter((a) => a.clinicId === selectedClinicFilter || (a.clinicName || "").includes(selectedClinicFilter))
    : appointments;

  const checkedIn = filtered.filter((a) => a.status === "CHECKED_IN");
  const waiting = filtered.filter((a) => a.status === "CONFIRMED" || a.status === "UPCOMING");
  const inConsultation = filtered.filter((a) => a.status === "IN_CONSULTATION");
  const delayed = filtered.filter((a) => a.status === "REQUESTED" || a.status === "RESCHEDULED");
  const completed = filtered.filter((a) => a.status === "COMPLETED");

  const columns = [
    { id: "checkedIn", title: "CURRENTLY CHECKED IN", count: checkedIn.length, items: checkedIn, color: "border-emerald-400 bg-emerald-50/50" },
    { id: "waiting", title: "WAITING IN LOUNGE", count: waiting.length, items: waiting, color: "border-sky-400 bg-sky-50/40" },
    { id: "inConsultation", title: "IN CONSULTATION", count: inConsultation.length, items: inConsultation, color: "border-purple-400 bg-purple-50/40" },
    { id: "delayed", title: "DELAYED / PENDING", count: delayed.length, items: delayed, color: "border-amber-400 bg-amber-50/40" },
    { id: "completed", title: "COMPLETED TODAY", count: completed.length, items: completed, color: "border-slate-300 bg-slate-50" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Live Operations Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Clinic Operations Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synchronized clinical throughput tracking across examination suites and waiting lounges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClinicFilter}
            onChange={(e) => setSelectedClinicFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
          >
            <option value="">All 4 Clinics</option>
            <option value="clinic-central">Vela Central Pavilion</option>
            <option value="clinic-mission-bay">Mission Bay Hub</option>
            <option value="clinic-marina">Marina Wellness</option>
            <option value="clinic-pac-heights">Pacific Heights</option>
          </select>

          <button
            onClick={fetchBoardData}
            title="Refresh feed"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 5-Column Live Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col min-h-[480px]"
          >
            {/* Column Header */}
            <div className={`p-3 rounded-2xl border-l-4 ${col.color} mb-3 flex items-center justify-between`}>
              <span className="text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                {col.title}
              </span>
              <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {col.count}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {col.items.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 italic">
                  No patients in this stage
                </div>
              ) : (
                col.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.scheduledTime}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500 truncate max-w-[100px]">
                        Ref: {item.referenceNo}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {item.patientName}
                      </h4>
                      <span className="text-[11px] text-sky-700 font-semibold block mt-0.5">
                        {item.doctorName}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.reason}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate">{item.clinicName?.replace("Vela ", "")}</span>
                      <span className="font-semibold text-slate-700">
                        {item.consultationType === "TELEHEALTH" ? "Tele" : "Suite 800"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
