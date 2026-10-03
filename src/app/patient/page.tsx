"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Bell,
  Calendar,
  Clock,
  ChevronRight,
  MessageSquare,
  Navigation,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Video,
  Building2,
  FileText,
  Search,
  ArrowRight,
} from "lucide-react";
import { Appointment, DoctorProfile, Notification } from "@/types";

export default function PatientHomePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInState, setCheckInState] = useState<"IDLE" | "SUCCESS">("IDLE");

  useEffect(() => {
    // Ensure logged in as demo patient if accessing directly
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user) {
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "patient@velahealth.com", password: "PatientPass123!" }),
          });
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
    try {
      const res = await fetch(`/api/appointments/${aptId}/check-in`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCheckInState("SUCCESS");
        // refresh appointments
        const refreshRes = await fetch("/api/appointments");
        const refreshData = await refreshRes.json();
        if (refreshData.appointments) setAppointments(refreshData.appointments);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5">
      {/* TOP HEADER: Greeting, Location, Notifications */}
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Maria Santos"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Good morning
            </span>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              Maria Santos
            </h1>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <MapPin className="w-3 h-3 text-sky-600" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        <Link
          href="/patient/profile"
          className="relative p-2.5 rounded-full bg-white border border-slate-200/80 shadow-sm text-slate-600 hover:text-slate-900"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </Link>
      </header>

      {/* NEXT APPOINTMENT CARD (HERO CARD) */}
      {nextAppointment ? (
        <div className="bg-white rounded-bubble p-5 border border-slate-200/90 shadow-bubble relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Next Appointment</span>
            </span>

            {nextAppointment.status === "CHECKED_IN" ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Checked In</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                Today at {nextAppointment.scheduledTime}
              </span>
            )}
          </div>

          <div className="flex items-start gap-3.5 mb-3">
            <img
              src={nextAppointment.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
              alt="Doctor"
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {nextAppointment.doctorName}
              </h3>
              <p className="text-xs text-sky-600 font-semibold">{nextAppointment.doctorSpecialty}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>{nextAppointment.clinicName}</span>
              </p>
            </div>
          </div>

          {/* DIGITAL CHECK-IN BANNER */}
          {nextAppointment.status !== "CHECKED_IN" ? (
            <div className="bg-sky-50/90 border border-sky-200/90 rounded-2xl p-3.5 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                  <span>Digital Check-In is Open</span>
                </span>
                <span className="text-[10px] text-sky-700 font-semibold">Starts in 20 min</span>
              </div>
              <p className="text-[11px] text-sky-800 mb-2.5 leading-snug">
                Check in now so reception and Dr. Reyes know you are on your way.
              </p>
              <button
                onClick={() => handleDigitalCheckIn(nextAppointment.id)}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Digital Check In Now</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You are checked in!</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-snug">
                Please proceed to <strong>Reception Area B</strong> on the 8th floor. Complimentary water and hydration bar available.
              </p>
            </div>
          )}

          {/* Quick Actions for Next Appointment */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center text-xs font-semibold">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(nextAppointment.clinicAddress || "")}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span>Directions</span>
            </a>
            <Link
              href="/patient/messages"
              className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span>Message</span>
            </Link>
            <Link
              href={`/patient/appointments/${nextAppointment.id}`}
              className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1 transition"
            >
              <span>Details</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-bubble p-6 border border-slate-200/90 text-center shadow-bubble">
          <Calendar className="w-10 h-10 text-sky-500 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-sm">No Appointments Today</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Need a checkup or dermatologist consult? Book an opening in seconds.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-sky-600 text-white font-bold text-xs shadow-sm"
          >
            <span>Book an Appointment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* QUICK ACTIONS ROW */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 block mb-2.5">
          Quick Actions
        </span>
        <div className="grid grid-cols-4 gap-2">
          <Link
            href="/book"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Book</span>
          </Link>

          <Link
            href="/patient/explore"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Clinics</span>
          </Link>

          <Link
            href="/doctors"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Doctors</span>
          </Link>

          <Link
            href="/telehealth"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800">Telehealth</span>
          </Link>
        </div>
      </div>

      {/* UNIQUE PATIENT FEATURE: CARE TIMELINE */}
      <div className="bg-white rounded-bubble p-5 border border-slate-200/90 shadow-bubble">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
              Personal Stream
            </span>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
              Care Timeline
            </h3>
          </div>
          <Link
            href="/patient/appointments"
            className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
          >
            <span>All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Chronological Stream */}
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {/* Item 1: Today */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-sky-600 ring-4 ring-sky-100" />
            <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Today • 10:30 AM</div>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">
              Dermatology Check-in & Follow-up
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dr. Elena Reyes • Vela Central Pavilion
            </p>
          </div>

          {/* Item 2: Tomorrow */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tomorrow • 2:00 PM</div>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">
              Cardiology Screening (Telehealth)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dr. Marcus Chen • Encrypted Video Consultation
            </p>
          </div>

          {/* Item 3: Last week */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Last Week</div>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">
              Consultation Completed & Summary Ready
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Desonide 0.05% prescription generated and sent to pharmacy.
            </p>
            <Link
              href="/patient/documents"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 mt-1 hover:underline"
            >
              <FileText className="w-3 h-3" />
              <span>View Visit Summary & Rx</span>
            </Link>
          </div>
        </div>
      </div>

      {/* DOCTORS AVAILABLE TODAY */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Available Today
          </span>
          <Link href="/doctors" className="text-xs font-semibold text-sky-600">
            See all
          </Link>
        </div>

        <div className="space-y-2.5">
          {doctors.slice(0, 2).map((doc) => (
            <div
              key={doc.userId}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={doc.user?.avatarUrl}
                  alt={doc.user?.firstName}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Dr. {doc.user?.firstName} {doc.user?.lastName}
                  </h4>
                  <span className="text-[11px] text-sky-600 font-medium block">{doc.specialtyName}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                    ● Available this afternoon
                  </span>
                </div>
              </div>

              <Link
                href={`/book?doctorId=${doc.userId}`}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm hover:bg-sky-700 transition"
              >
                Book
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
