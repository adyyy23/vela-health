"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Stethoscope,
  Video,
  FileText,
  Activity,
  Heart,
  Footprints,
  MoreHorizontal,
  Check,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Appointment, DoctorProfile, User as UserType } from "@/types";

export default function PatientHomePage() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, text: "Take Atorvastatin 20mg", subtext: "With dinner • Prescribed by Dr. Reyes", completed: false },
    { id: 2, text: "Fasting blood panel tomorrow 8:00 AM", subtext: "No food after 10 PM tonight", completed: false },
  ]);

  useEffect(() => {
    // Ensure logged in as demo patient if accessing directly
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user) {
          const loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "patient@velahealth.com", password: "PatientPass123!" }),
          });
          const loginData = await loginRes.json();
          if (loginData.user) setCurrentUser(loginData.user);
        } else {
          setCurrentUser(data.user);
        }
      })
      .then(() => {
        Promise.all([
          fetch("/api/appointments").then((r) => r.json()),
          fetch("/api/doctors").then((r) => r.json()),
        ]).then(([aptData, docData]) => {
          if (aptData.appointments) setAppointments(aptData.appointments);
          if (docData.doctors) setDoctors(docData.doctors);
          setLoading(false);
        });
      });
  }, []);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "UPCOMING" || a.status === "CHECKED_IN"
  );
  const nextAppointment = upcomingAppointments[0];

  const handleDigitalCheckIn = async (aptId: string) => {
    setCheckInLoading(true);
    try {
      const res = await fetch(`/api/appointments/${aptId}/check-in`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        // refresh appointments
        const refreshRes = await fetch("/api/appointments");
        const refreshData = await refreshRes.json();
        if (refreshData.appointments) setAppointments(refreshData.appointments);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckInLoading(false);
    }
  };

  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const patientName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Alex Johnson";

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 text-vela-ink">
      {/* 1. TOP HEADER: Greeting, Avatar, Options */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
              alt={patientName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-[#E2E8E4]"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-vela-muted uppercase tracking-wider block">
              Good morning,
            </span>
            <h1 className="text-lg font-bold text-vela-ink tracking-tight leading-tight">
              {patientName}
            </h1>
          </div>
        </div>

        <Link
          href="/patient/profile"
          className="w-10 h-10 rounded-full bg-white border border-[#E2E8E4] flex items-center justify-center text-vela-muted hover:text-vela-ink hover:border-vela-sage/40 transition shadow-sm"
          title="Account Settings"
        >
          <MoreHorizontal className="w-5 h-5" />
        </Link>
      </header>

      {/* 2. HERO CARD: YOUR NEXT VISIT (Deep Forest Sage Card from Reference Mockup) */}
      {nextAppointment ? (
        <div className="bg-vela-forest text-white rounded-[20px] p-5 shadow-[0_12px_32px_rgba(27,54,41,0.18)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          {/* Card Tag & Status */}
          <div className="flex items-center justify-between mb-3.5 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/90 bg-white/10 px-2.5 py-1 rounded-pill">
              Your Next Visit
            </span>
            <span className="text-xs font-semibold text-emerald-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{nextAppointment.status === "CHECKED_IN" ? "Checked In" : "Confirmed"}</span>
            </span>
          </div>

          {/* Doctor Info */}
          <div className="flex items-start gap-3.5 mb-4 relative z-10">
            <img
              src={nextAppointment.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
              alt={nextAppointment.doctorName}
              className="w-13 h-13 rounded-2xl object-cover border border-white/20 shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base leading-tight truncate">
                {nextAppointment.doctorName}
              </h3>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                {nextAppointment.doctorSpecialty}
              </p>
            </div>
          </div>

          {/* Time & Location Pill Strip */}
          <div className="bg-black/15 rounded-xl p-3 mb-4 space-y-2 relative z-10 text-xs text-emerald-50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-semibold">Today, {nextAppointment.scheduledTime}</span>
              <span className="text-emerald-300/60">•</span>
              <span className="text-emerald-200/90">30 min consult</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="truncate">{nextAppointment.clinicName || "Vela Central Pavilion"} • Wing A, Rm 402</span>
            </div>
          </div>

          {/* Action Button: Check In Now */}
          {nextAppointment.status !== "CHECKED_IN" ? (
            <button
              onClick={() => handleDigitalCheckIn(nextAppointment.id)}
              disabled={checkInLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-50 text-vela-forest font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 active:scale-[0.99] relative z-10"
            >
              {checkInLoading ? (
                <span>Checking In...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-vela-sage" />
                  <span>Check In Now</span>
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-900/60 border border-emerald-400/30 text-emerald-100 text-xs font-semibold flex items-center justify-center gap-2 relative z-10">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Checked in • Proceed to Room 402 waiting lounge</span>
            </div>
          )}

          {/* Quick Sub-Actions */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center text-xs font-medium relative z-10">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(nextAppointment.clinicAddress || nextAppointment.clinicName || "Vela Health")}`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/90 flex items-center justify-center gap-1.5 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-300" />
              <span>Map</span>
            </a>
            <Link
              href="/patient/messages"
              className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/90 flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
              <span>Message</span>
            </Link>
            <Link
              href={`/patient/appointments/${nextAppointment.id}`}
              className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/90 flex items-center justify-center gap-1.5 transition"
            >
              <span>Details</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-card p-6 border border-[#E2E8E4] text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-vela-surfaceSubtle text-vela-sage flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-vela-ink text-base">No Visits Today</h3>
          <p className="text-xs text-vela-muted mt-1 mb-4 max-w-xs mx-auto">
            Ready for a preventive exam or specialist consult? Explore available times across our clinic network.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vela-sage text-white font-bold text-xs shadow-sm hover:bg-vela-sageDark transition"
          >
            <span>Book an Appointment</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 3. QUICK ACTIONS GRID (4 Circular/Bubble Icons) */}
      <div>
        <div className="grid grid-cols-4 gap-2.5">
          <Link
            href="/book"
            className="flex flex-col items-center justify-center p-3 rounded-card bg-white border border-[#E2E8E4] shadow-sm hover:border-vela-sage/40 transition group"
          >
            <div className="w-11 h-11 rounded-2xl bg-vela-surfaceSubtle text-vela-sage flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-vela-ink">Book</span>
          </Link>

          <Link
            href="/patient/explore"
            className="flex flex-col items-center justify-center p-3 rounded-card bg-white border border-[#E2E8E4] shadow-sm hover:border-vela-sage/40 transition group"
          >
            <div className="w-11 h-11 rounded-2xl bg-vela-surfaceSubtle text-vela-sage flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-vela-ink">Find Care</span>
          </Link>

          <Link
            href="/telehealth"
            className="flex flex-col items-center justify-center p-3 rounded-card bg-white border border-[#E2E8E4] shadow-sm hover:border-vela-sage/40 transition group"
          >
            <div className="w-11 h-11 rounded-2xl bg-vela-surfaceSubtle text-vela-sage flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-vela-ink">Telehealth</span>
          </Link>

          <Link
            href="/patient/documents"
            className="flex flex-col items-center justify-center p-3 rounded-card bg-white border border-[#E2E8E4] shadow-sm hover:border-vela-sage/40 transition group"
          >
            <div className="w-11 h-11 rounded-2xl bg-vela-surfaceSubtle text-vela-sage flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-vela-ink">Records</span>
          </Link>
        </div>
      </div>

      {/* 4. VITALS STRIP */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-vela-muted">
            Your Vitals
          </span>
          <span className="text-[11px] text-vela-muted">Synced 10m ago</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Heart Rate */}
          <div className="p-3 rounded-card bg-white border border-[#E2E8E4] shadow-sm">
            <div className="flex items-center justify-between text-rose-500 mb-1">
              <Heart className="w-4 h-4 fill-rose-50" />
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Normal
              </span>
            </div>
            <div className="text-base font-extrabold text-vela-ink">72 <span className="text-[10px] font-medium text-vela-muted">bpm</span></div>
            <div className="text-[10px] text-vela-muted mt-0.5">Resting Heart Rate</div>
          </div>

          {/* Daily Steps */}
          <div className="p-3 rounded-card bg-white border border-[#E2E8E4] shadow-sm">
            <div className="flex items-center justify-between text-vela-sage mb-1">
              <Footprints className="w-4 h-4" />
              <span className="text-[10px] font-bold text-vela-sage bg-vela-surfaceSubtle px-1.5 py-0.5 rounded">
                84%
              </span>
            </div>
            <div className="text-base font-extrabold text-vela-ink">8,420 <span className="text-[10px] font-medium text-vela-muted">steps</span></div>
            <div className="text-[10px] text-vela-muted mt-0.5">Goal 10,000</div>
          </div>

          {/* Blood Pressure */}
          <div className="p-3 rounded-card bg-white border border-[#E2E8E4] shadow-sm">
            <div className="flex items-center justify-between text-teal-600 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <div className="text-base font-extrabold text-vela-ink">118/78 <span className="text-[10px] font-medium text-vela-muted">mmHg</span></div>
            <div className="text-[10px] text-vela-muted mt-0.5">Blood Pressure</div>
          </div>
        </div>
      </div>

      {/* 5. CARE NEAR YOU (Map Card) */}
      <div className="p-4 rounded-surface bg-white border border-[#E2E8E4] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-vela-sage block">
              Care Near You
            </span>
            <h3 className="font-bold text-vela-ink text-sm">
              Vela Downtown Health Pavilion
            </h3>
          </div>
          <Link
            href="/patient/explore"
            className="text-xs font-semibold text-vela-sage hover:text-vela-sageDark flex items-center gap-1"
          >
            <span>Explore Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Visual Map Banner */}
        <div className="relative h-28 rounded-xl overflow-hidden mb-3 border border-[#E2E8E4] bg-[#EDF3EE] flex items-center justify-center">
          {/* Subtle map grid pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3B6B55_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-vela-forest text-white flex items-center justify-center shadow-md ring-4 ring-white">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-vela-forest mt-1.5 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
              1.2 miles away • 4 min drive
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-vela-muted">
          <span>742 Montgomery St, San Francisco</span>
          <span className="font-semibold text-emerald-600">Open until 8:00 PM</span>
        </div>
      </div>

      {/* 6. TODAY'S REMINDERS */}
      <div className="p-4 rounded-surface bg-white border border-[#E2E8E4] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-vela-ink uppercase tracking-wider">
            Today&apos;s Reminders
          </span>
          <span className="text-[11px] text-vela-muted">
            {reminders.filter((r) => r.completed).length}/{reminders.length} done
          </span>
        </div>

        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              onClick={() => toggleReminder(reminder.id)}
              className={`p-3 rounded-card border transition cursor-pointer flex items-start gap-3 ${
                reminder.completed
                  ? "bg-vela-surfaceSubtle/50 border-[#E2E8E4] text-vela-muted"
                  : "bg-white border-[#E2E8E4] hover:border-vela-sage/40"
              }`}
            >
              <button
                className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition shrink-0 ${
                  reminder.completed
                    ? "bg-vela-forest text-white"
                    : "border-2 border-slate-300 hover:border-vela-forest"
                }`}
              >
                {reminder.completed && <Check className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${reminder.completed ? "line-through text-vela-muted" : "text-vela-ink"}`}>
                  {reminder.text}
                </p>
                <p className="text-[11px] text-vela-muted mt-0.5">{reminder.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. CARE TIMELINE */}
      <div className="p-4 rounded-surface bg-white border border-[#E2E8E4] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-vela-sage block">
              Continuous Care
            </span>
            <h3 className="font-bold text-vela-ink text-sm">
              Care Timeline
            </h3>
          </div>
          <Link
            href="/patient/appointments"
            className="text-xs font-semibold text-vela-sage hover:text-vela-sageDark flex items-center gap-0.5"
          >
            <span>History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Chronological Stream */}
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8E4]">
          {/* Item 1: Today */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-vela-forest ring-4 ring-[#EAF0EC]" />
            <div className="text-[10px] font-bold text-vela-sage uppercase tracking-wider">Today • 2:30 PM</div>
            <h4 className="text-xs font-bold text-vela-ink mt-0.5">
              Cardiology Consultation & Review
            </h4>
            <p className="text-[11px] text-vela-muted mt-0.5">
              Dr. Sarah Jenkins • Vela Central Pavilion
            </p>
          </div>

          {/* Item 2: Tomorrow */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
            <div className="text-[10px] font-bold text-vela-muted uppercase tracking-wider">Tomorrow • 8:00 AM</div>
            <h4 className="text-xs font-bold text-vela-ink mt-0.5">
              Comprehensive Metabolic Panel
            </h4>
            <p className="text-[11px] text-vela-muted mt-0.5">
              Main Diagnostic Lab • Fasting Required
            </p>
          </div>

          {/* Item 3: Completed */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Completed Last Week</div>
            <h4 className="text-xs font-bold text-vela-ink mt-0.5">
              Dermatology Check-in & Summary Ready
            </h4>
            <p className="text-[11px] text-vela-muted mt-0.5">
              Desonide 0.05% prescription generated and dispatched.
            </p>
            <Link
              href="/patient/documents"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-vela-sage mt-1 hover:underline"
            >
              <FileText className="w-3 h-3" />
              <span>View Visit Summary & Rx</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
