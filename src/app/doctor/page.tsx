"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Activity,
  Heart,
  Thermometer,
  Plus,
  Send,
  UserCheck,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { Appointment } from "@/types";

export default function DoctorTodayPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingVisit, setStartingVisit] = useState(false);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Review lipid panel results & blood chemistry", checked: true },
    { id: 2, text: "Renew Lisinopril 10mg prescription (90-day refill)", checked: false },
    { id: 3, text: "Order diagnostic resting ECG prior to conclusion", checked: false },
    { id: 4, text: "Verify home BP logbook entries from past 14 days", checked: false },
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const loadAppointments = () => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Authenticate demo doctor session
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
      .then(() => loadAppointments());
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (a) => a.scheduledDate === todayStr || a.status === "CHECKED_IN" || a.status === "IN_CONSULTATION"
  );

  // Next patient priority: in consultation > checked in > confirmed > first today
  const activeConsultation = todayAppointments.find((a) => a.status === "IN_CONSULTATION");
  const nextCheckedIn = todayAppointments.find((a) => a.status === "CHECKED_IN");
  const nextConfirmed = todayAppointments.find((a) => a.status === "CONFIRMED" || a.status === "UPCOMING");
  const nextPatient = activeConsultation || nextCheckedIn || nextConfirmed || todayAppointments[0];

  const handleStartVisit = async (appointmentId: string) => {
    setStartingVisit(true);
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "IN_CONSULTATION",
          note: "Clinician initiated consultation in Exam Room 302.",
        }),
      });
      router.push(`/doctor/workspace/${appointmentId}`);
    } catch (e) {
      router.push(`/doctor/workspace/${appointmentId}`);
    } finally {
      setStartingVisit(false);
    }
  };

  // Clinical timeline schedule data
  const scheduleTimeline = [
    {
      id: "apt-0900",
      time: "09:00 AM",
      patient: "Eleanor Vance",
      type: "Follow-up",
      status: "COMPLETED",
      room: "Rm 302",
    },
    {
      id: nextPatient?.id || "apt-1000",
      time: "10:00 AM",
      patient: nextPatient?.patientName || "Robert Henderson",
      type: nextPatient?.reason || "Hypertension Review",
      status: nextPatient?.status === "IN_CONSULTATION" ? "IN_CONSULTATION" : "CURRENT",
      room: "Rm 302",
      isCurrent: true,
    },
    {
      id: "apt-1130",
      time: "11:30 AM",
      patient: "David Kim",
      type: "Annual Physical",
      status: "CONFIRMED",
      room: "Rm 302",
    },
    {
      id: "apt-1400",
      time: "02:00 PM",
      patient: "Maria Clara Santos",
      type: "Dermatology Review",
      status: "CHECKED_IN",
      room: "Rm 304",
    },
    {
      id: "apt-1530",
      time: "03:30 PM",
      patient: "James Wilson",
      type: "Routine Screening",
      status: "TELEHEALTH",
      room: "Telehealth",
    },
  ];

  return (
    <div className="flex flex-col gap-5 text-vela-ink font-sans max-w-7xl mx-auto w-full">
      {/* ============================================================ */}
      {/* 1. CLINICAL OPERATIONAL HEADER (No Giant Competing Cards) */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-vela-border pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage">
              Clinical Workspace
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-emerald-800 bg-[#EAF0EC] px-2 py-0.5 rounded-[5px] font-semibold flex items-center gap-1.5 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Exam Suite 302 • Ready</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-vela-ink tracking-tight">
            Welcome back, Dr. Reyes
          </h1>
        </div>

        {/* Compact Inline Operational Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-white px-3.5 py-2 rounded-card border border-vela-border shadow-vela-subtle">
          <div className="flex items-center gap-1.5 font-semibold text-vela-ink">
            <Users className="w-3.5 h-3.5 text-vela-sage" />
            <span>8 / 12 Patients Today</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 font-semibold text-vela-ink">
            <Clock className="w-3.5 h-3.5 text-vela-sage" />
            <span>22m Avg Visit</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>94% Completed</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. ADAPTIVE MAIN CLINICAL LAYOUT */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================ */}
        {/* MAIN COLUMN (8 cols): NEXT PATIENT WORKSPACE DOMINATES */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* NEXT PATIENT HERO WORKSPACE */}
          <div className="bg-white rounded-surface p-5 sm:p-6 border border-vela-border shadow-vela-card">
            {/* Header / Urgency Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-vela-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  {nextPatient?.status === "IN_CONSULTATION" ? "Consultation In Progress" : "Next Patient Ready"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-vela-muted font-medium">Reception Area B • Rm 302</span>
              </div>
              <span className="text-xs font-bold text-vela-forest bg-vela-surfaceSubtle px-2.5 py-1 rounded-[6px]">
                10:00 AM (30 min)
              </span>
            </div>

            {/* Patient Header Identity */}
            <div className="flex items-start gap-4 mb-5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
                alt="Robert Henderson"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-card object-cover border border-vela-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-vela-ink tracking-tight">
                    {nextPatient?.patientName || "Robert Henderson"}
                  </h2>
                  <span className="text-[11px] font-mono text-vela-muted">
                    Record #8921 • DOB: 1979-05-12 (47y)
                  </span>
                </div>
                <p className="text-xs text-vela-sage font-bold mt-0.5">
                  {nextPatient?.reason || "Hypertension Review & Lipid Profile Follow-Up"}
                </p>
                <p className="text-[11px] text-vela-muted mt-1">
                  Last visit: 3 months ago (Routine baseline) • Attending: Dr. Elena Reyes
                </p>
              </div>
            </div>

            {/* RELEVANT VITALS: Clean Columns with Dividers (NO Mini Containers) */}
            <div className="py-3 px-4 rounded-card bg-[#F7F9F7] border border-vela-border mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-vela-muted block mb-2">
                Triage Vitals (Recorded at Digital Check-In)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-vela-border text-center">
                <div className="py-1 sm:py-0 sm:px-3 first:pl-0">
                  <span className="text-[10px] text-vela-muted block">Blood Pressure</span>
                  <span className="text-sm sm:text-base font-extrabold text-vela-ink">132 / 86</span>
                  <span className="text-[10px] text-amber-800 font-semibold block">Stage 1</span>
                </div>
                <div className="py-1 sm:py-0 sm:px-3">
                  <span className="text-[10px] text-vela-muted block">Heart Rate</span>
                  <span className="text-sm sm:text-base font-extrabold text-vela-ink">74 <span className="text-[10px] font-normal text-slate-500">bpm</span></span>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Normal</span>
                </div>
                <div className="py-1 sm:py-0 sm:px-3">
                  <span className="text-[10px] text-vela-muted block">SpO2 Oxygen</span>
                  <span className="text-sm sm:text-base font-extrabold text-vela-ink">98%</span>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Optimal</span>
                </div>
                <div className="py-1 sm:py-0 sm:px-3">
                  <span className="text-[10px] text-vela-muted block">Body Temp</span>
                  <span className="text-sm sm:text-base font-extrabold text-vela-ink">98.4°F</span>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Afebrile</span>
                </div>
              </div>
            </div>

            {/* REQUIRED CLINICAL ACTIONS (Actionable Checklist) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-vela-muted">
                  Required Clinical Actions for Encounter
                </span>
                <span className="text-[11px] text-slate-500">
                  {checklist.filter((c) => c.checked).length} of {checklist.length} completed
                </span>
              </div>

              <div className="divide-y divide-vela-border border-y border-vela-border text-xs">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className="w-full py-2.5 px-1 flex items-center justify-between text-left hover:bg-[#F7F9F7] transition rounded-md group"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                      )}
                      <span
                        className={`${
                          item.checked ? "line-through text-slate-400" : "text-vela-ink font-medium"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                    <span className="text-[10px] text-vela-sage opacity-0 group-hover:opacity-100 transition">
                      {item.checked ? "Undo" : "Mark done"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* DIRECT ACTION BUTTONS: Real State Triggers */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => nextPatient && handleStartVisit(nextPatient.id)}
                disabled={startingVisit}
                className="flex-1 min-w-[160px] py-2.5 px-4 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{startingVisit ? "Opening Session..." : "Start Clinical Visit"}</span>
              </button>

              <Link
                href={`/doctor/messages?patient=${encodeURIComponent(nextPatient?.patientName || "Robert Henderson")}`}
                className="py-2.5 px-4 rounded-button bg-vela-surfaceSubtle hover:bg-slate-200 text-vela-ink text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-vela-sage" />
                <span>Message Patient</span>
              </Link>

              <Link
                href={nextPatient ? `/doctor/workspace/${nextPatient.id}` : "/doctor"}
                className="py-2.5 px-4 rounded-button bg-white border border-vela-border hover:bg-[#F7F9F7] text-vela-ink text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <FileEdit className="w-3.5 h-3.5 text-vela-muted" />
                <span>Open Full Chart</span>
              </Link>
            </div>
          </div>

          {/* PATIENT QUEUE & ACTIVE WAITING LOUNGE */}
          <div className="bg-white rounded-card p-4 sm:p-5 border border-vela-border shadow-vela-subtle">
            <div className="flex items-center justify-between mb-3 border-b border-vela-border pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-vela-sage" />
                <h3 className="font-bold text-sm text-vela-ink">Patient Queue & Lounge</h3>
              </div>
              <span className="text-[11px] text-vela-muted font-medium">
                {todayAppointments.length} scheduled today
              </span>
            </div>

            <div className="divide-y divide-vela-border text-xs">
              {todayAppointments.slice(0, 4).map((apt) => (
                <div
                  key={apt.id}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#F7F9F7] px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-vela-surfaceSubtle flex items-center justify-center font-bold text-xs text-vela-forest shrink-0">
                      {apt.patientName?.split(" ").map((n) => n[0]).join("") || "PT"}
                    </div>
                    <div>
                      <h4 className="font-bold text-vela-ink text-xs">{apt.patientName}</h4>
                      <p className="text-[11px] text-vela-muted line-clamp-1">
                        {apt.scheduledTime} • {apt.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-[5px] ${
                        apt.status === "CHECKED_IN"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : apt.status === "IN_CONSULTATION"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {apt.status.replace("_", " ")}
                    </span>

                    <button
                      onClick={() => handleStartVisit(apt.id)}
                      className="px-2.5 py-1 rounded-md bg-vela-surfaceSubtle hover:bg-vela-sage hover:text-white text-vela-ink font-semibold text-[11px] transition"
                    >
                      Chart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT SIDE PANEL (4 cols): CHRONOLOGICAL SCHEDULE TIMELINE */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-surface p-4 sm:p-5 border border-vela-border shadow-vela-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-vela-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-vela-sage" />
                <h3 className="font-bold text-sm text-vela-ink">Today's Schedule</h3>
              </div>
              <Link
                href="/doctor/schedule"
                className="text-[11px] font-semibold text-vela-sage hover:text-vela-sageDark"
              >
                Full Calendar →
              </Link>
            </div>

            {/* Chronological Timeline */}
            <div className="space-y-2.5">
              {scheduleTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-card transition border ${
                    item.isCurrent
                      ? "bg-[#F7F9F7] border-vela-sage shadow-sm ring-1 ring-vela-sage/30"
                      : "bg-white hover:bg-[#F7F9F7] border-vela-border"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-mono font-bold ${item.isCurrent ? "text-vela-forest text-sm" : "text-vela-ink"}`}>
                      {item.time}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-[4px] ${
                        item.status === "COMPLETED"
                          ? "bg-slate-100 text-slate-500"
                          : item.status === "CURRENT" || item.status === "IN_CONSULTATION"
                          ? "bg-emerald-100 text-emerald-900 font-bold"
                          : item.status === "CHECKED_IN"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-vela-ink">{item.patient}</h4>
                  <div className="flex items-center justify-between text-[11px] text-vela-muted mt-0.5">
                    <span>{item.type}</span>
                    <span className="font-medium text-slate-500">{item.room}</span>
                  </div>

                  {item.isCurrent && (
                    <div className="mt-2 pt-2 border-t border-vela-border flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Ready in Exam Room 302</span>
                      </span>
                      <button
                        onClick={() => nextPatient && handleStartVisit(nextPatient.id)}
                        className="text-[11px] font-bold text-vela-sage hover:text-vela-sageDark"
                      >
                        Enter Room →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Walk-in Add */}
            <div className="mt-4 pt-3 border-t border-vela-border">
              <Link
                href="/book?walkin=true"
                className="w-full py-2 rounded-button bg-vela-surfaceSubtle hover:bg-slate-200 text-vela-ink text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-vela-sage" />
                <span>Add Walk-in Encounter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
