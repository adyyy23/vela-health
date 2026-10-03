"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  CheckCircle2,
  Users,
  MessageSquare,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  ArrowRight,
  Video,
  Building2,
  FileEdit,
} from "lucide-react";
import { Appointment } from "@/types";

export default function DoctorTodayPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure logged in as doctor
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user || data.user.role !== "DOCTOR") {
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "doctor.reyes@velahealth.com", password: "DoctorPass123!" }),
          });
        }
      })
      .then(() => {
        fetch("/api/appointments")
          .then((r) => r.json())
          .then((data) => {
            if (data.appointments) setAppointments(data.appointments);
            setLoading(false);
          });
      });
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.scheduledDate === todayStr || a.status === "CHECKED_IN");
  const nextPatient = todayAppointments.find((a) => a.status === "CHECKED_IN" || a.status === "CONFIRMED") || todayAppointments[0];

  const timelineHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Greeting, Date, Quick Stats */}
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
            Clinical Schedule Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, Dr. Reyes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} • Vela Central Pavilion (Suite 800)
          </p>
        </div>

        {/* Quick Tally Chips */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Checked In</span>
            <span className="text-base font-extrabold">1 Patient Waiting</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-sky-600 block">Today's Visits</span>
            <span className="text-base font-extrabold">{todayAppointments.length || 3} Consults</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Unread Msgs</span>
            <span className="text-base font-extrabold">2 Inquiries</span>
          </div>
        </div>
      </div>

      {/* Grid: Left Column Next Patient & Timeline (Col 8), Right Column Quick Triage (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Next Patient & Spatial Timeline (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* NEXT PATIENT HERO CARD */}
          {nextPatient && (
            <div className="bg-white rounded-bubble p-6 border-2 border-sky-400 shadow-bubble relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Next Patient Ready • Reception Area B
                  </span>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {nextPatient.scheduledTime} ({nextPatient.durationMinutes} min)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                    alt={nextPatient.patientName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {nextPatient.patientName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      DOB: Apr 1995 (29y) • Blood: O+ • Ref: {nextPatient.referenceNo}
                    </p>
                    <p className="text-xs text-sky-700 font-semibold mt-1">
                      Reason: {nextPatient.reason}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/doctor/workspace/${nextPatient.id}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0"
                >
                  <FileEdit className="w-4 h-4" />
                  <span>Launch Clinical Workspace</span>
                </Link>
              </div>
            </div>
          )}

          {/* SPATIAL TIMELINE (Time-Spanning Day View) */}
          <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Chronological Day Schedule
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Today's Spatial Timeline
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Operating Hours: 08:30 AM - 5:00 PM
              </span>
            </div>

            {/* Hourly Grid */}
            <div className="space-y-4 relative before:absolute before:left-14 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {timelineHours.map((hour) => {
                const hourPrefix = hour.split(":")[0];
                const matchingApts = todayAppointments.filter((a) => a.scheduledTime.startsWith(hourPrefix));

                return (
                  <div key={hour} className="flex items-start gap-4 text-xs">
                    <span className="w-10 font-bold text-slate-400 shrink-0 text-right pt-2 font-mono">
                      {hour}
                    </span>

                    <div className="flex-1 min-h-[44px]">
                      {matchingApts.length > 0 ? (
                        matchingApts.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                              apt.status === "CHECKED_IN"
                                ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                                : apt.status === "COMPLETED"
                                ? "bg-slate-50 border-slate-200 text-slate-500"
                                : "bg-sky-50/60 border-sky-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  apt.status === "CHECKED_IN"
                                    ? "bg-emerald-500 animate-pulse"
                                    : apt.status === "COMPLETED"
                                    ? "bg-slate-400"
                                    : "bg-sky-500"
                                }`}
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">
                                  {apt.scheduledTime} • {apt.patientName}
                                </span>
                                <span className="text-[11px] text-slate-500">{apt.reason}</span>
                              </div>
                            </div>

                            <Link
                              href={`/doctor/workspace/${apt.id}`}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200 shadow-sm flex items-center gap-1"
                            >
                              <span>Workspace</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="h-9 border-b border-dashed border-slate-100 flex items-center text-[11px] text-slate-300">
                          <span>Open Clinic Slot</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Waiting Patients & Quick Communications (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Waiting Patients Lounge */}
          <div className="bg-white rounded-bubble p-6 border border-slate-200/90 shadow-bubble">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Waiting Patients</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1 Waiting
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Maria Santos"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Maria Santos</h4>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    Checked in 15 min ago (Area B)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Unread Patient Inquiries */}
          <div className="bg-white rounded-bubble p-6 border border-slate-200/90 shadow-bubble">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Patient Messages</h3>
              <Link href="/doctor/messages" className="text-xs font-semibold text-sky-600">
                Open Inbox →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">Maria Santos</span>
                  <span className="text-[10px] text-slate-400">10:24 AM</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  "Thank you Dr. Reyes! I am seated by Reception Area B with the hydration bar."
                </p>
              </div>
            </div>
          </div>

          {/* Quick Schedule Management */}
          <div className="bg-white rounded-bubble p-6 border border-slate-200/90 shadow-bubble">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Availability Controls</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/doctor/availability"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition text-center block"
              >
                Modify Weekly Hours & Breaks
              </Link>
              <Link
                href="/doctor/patients"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition text-center block"
              >
                View Patient Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
