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
    <div className="flex flex-col gap-5 p-4 sm:p-5 text-vela-ink">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage block">
          Healthcare Stream
        </span>
        <h1 className="text-2xl font-extrabold text-vela-ink tracking-tight">
          My Care Appointments
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-vela-surfaceSubtle p-1 rounded-card border border-[#E2E8E4]">
        <button
          onClick={() => setTab("UPCOMING")}
          className={`flex-1 py-2 text-xs font-bold rounded-button transition ${
            tab === "UPCOMING" ? "bg-white text-vela-ink shadow-sm" : "text-vela-muted"
          }`}
        >
          Upcoming ({appointments.filter((a) => ["REQUESTED", "CONFIRMED", "UPCOMING", "CHECKED_IN", "IN_CONSULTATION"].includes(a.status)).length})
        </button>
        <button
          onClick={() => setTab("COMPLETED")}
          className={`flex-1 py-2 text-xs font-bold rounded-button transition ${
            tab === "COMPLETED" ? "bg-white text-vela-ink shadow-sm" : "text-vela-muted"
          }`}
        >
          Past ({appointments.filter((a) => a.status === "COMPLETED").length})
        </button>
        <button
          onClick={() => setTab("CANCELLED")}
          className={`flex-1 py-2 text-xs font-bold rounded-button transition ${
            tab === "CANCELLED" ? "bg-white text-vela-ink shadow-sm" : "text-vela-muted"
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Appointment cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-vela-muted">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 rounded-card bg-white border border-[#E2E8E4] text-center shadow-sm">
            <Calendar className="w-8 h-8 text-vela-muted/40 mx-auto mb-2" />
            <p className="text-xs text-vela-muted">No {tab.toLowerCase()} appointments.</p>
            <Link
              href="/book"
              className="mt-3 inline-block px-4 py-2 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition"
            >
              Book New Appointment
            </Link>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <Link
              key={apt.id}
              href={`/patient/appointments/${apt.id}`}
              className="block p-4 rounded-card bg-white border border-[#E2E8E4] shadow-sm hover:border-vela-sage/40 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-vela-muted uppercase tracking-wider">
                  Ref: {apt.referenceNo}
                </span>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-pill border ${
                    apt.status === "CHECKED_IN"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : apt.status === "COMPLETED"
                      ? "bg-vela-surfaceSubtle text-vela-muted border-[#E2E8E4]"
                      : "bg-[#EAF0EC] text-vela-forest border-vela-sage/20"
                  }`}
                >
                  {apt.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <img
                  src={apt.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
                  alt={apt.doctorName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E2E8E4] shrink-0"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-vela-ink text-sm">{apt.doctorName}</h3>
                  <span className="text-xs text-vela-sage font-semibold block">{apt.doctorSpecialty}</span>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-vela-muted">
                    <span className="flex items-center gap-1 font-semibold text-vela-ink">
                      <Clock className="w-3.5 h-3.5 text-vela-muted" />
                      <span>{apt.scheduledDate} at {apt.scheduledTime}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      {apt.consultationType === "TELEHEALTH" ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-vela-sage" />
                          <span>Telehealth</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-vela-muted" />
                          <span>{apt.clinicName}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-vela-muted/40 group-hover:text-vela-ink transition self-center" />
              </div>

              {apt.status === "CHECKED_IN" && (
                <div className="mt-3 pt-2 border-t border-[#E2E8E4] flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
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
