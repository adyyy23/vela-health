"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Appointment } from "@/types";
import { Calendar, Clock, ChevronRight, CheckCircle2, FileEdit } from "lucide-react";

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
          Calendar Overview
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Doctor Schedule & Workload
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review upcoming daily and weekly schedules across all affiliated clinics.
        </p>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">{apt.scheduledDate} at {apt.scheduledTime}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  {apt.consultationType}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800">{apt.patientName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{apt.reason}</p>
            </div>

            <Link
              href={`/doctor/workspace/${apt.id}`}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
