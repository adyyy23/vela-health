"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Appointment } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Video,
  Building2,
  AlertCircle,
  FileText,
  Star,
} from "lucide-react";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<"UPCOMING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
        setLoading(false);
      });
  }, []);

  const filteredAppointments = appointments.filter((a) => {
    if (tab === "UPCOMING") {
      return ["REQUESTED", "CONFIRMED", "UPCOMING", "CHECKED_IN", "IN_CONSULTATION"].includes(a.status);
    }
    if (tab === "COMPLETED") {
      return a.status === "COMPLETED";
    }
    return ["CANCELLED", "NO_SHOW", "RESCHEDULED"].includes(a.status);
  });

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block">
          Healthcare Stream
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          My Care Appointments
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
        <button
          onClick={() => setTab("UPCOMING")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            tab === "UPCOMING" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          }`}
        >
          Upcoming ({appointments.filter((a) => ["REQUESTED", "CONFIRMED", "UPCOMING", "CHECKED_IN", "IN_CONSULTATION"].includes(a.status)).length})
        </button>
        <button
          onClick={() => setTab("COMPLETED")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            tab === "COMPLETED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          }`}
        >
          Past ({appointments.filter((a) => a.status === "COMPLETED").length})
        </button>
        <button
          onClick={() => setTab("CANCELLED")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            tab === "CANCELLED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Appointment cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center shadow-sm">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No {tab.toLowerCase()} appointments.</p>
            <Link
              href="/book"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              Book New Appointment
            </Link>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <Link
              key={apt.id}
              href={`/patient/appointments/${apt.id}`}
              className="block p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ref: {apt.referenceNo}
                </span>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    apt.status === "CHECKED_IN"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : apt.status === "COMPLETED"
                      ? "bg-slate-100 text-slate-700 border-slate-200"
                      : "bg-sky-50 text-sky-700 border-sky-100"
                  }`}
                >
                  {apt.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <img
                  src={apt.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
                  alt={apt.doctorName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h3>
                  <span className="text-xs text-sky-600 font-semibold block">{apt.doctorSpecialty}</span>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.scheduledDate} at {apt.scheduledTime}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      {apt.consultationType === "TELEHEALTH" ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-sky-600" />
                          <span>Telehealth</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{apt.clinicName}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition self-center" />
              </div>

              {apt.status === "CHECKED_IN" && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Checked In • Please proceed to Reception Area B</span>
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
