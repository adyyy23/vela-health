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
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
          Calendar Overview
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
          Doctor Schedule & Workload
        </h1>
        <p className="text-xs text-vela-muted mt-1">
          Review upcoming daily and weekly schedules across all affiliated clinics.
        </p>
      </div>

      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="p-5 rounded-card bg-white border border-[#E2E8E4] shadow-sm flex items-center justify-between gap-4 hover:border-vela-sage/30 transition"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-vela-ink">{apt.scheduledDate} at {apt.scheduledTime}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-[#EAF0EC] text-vela-forest border border-vela-sage/20">
                  {apt.consultationType}
                </span>
              </div>
              <h4 className="font-bold text-sm text-vela-ink">{apt.patientName}</h4>
              <p className="text-xs text-vela-muted mt-0.5">{apt.reason}</p>
            </div>

            <Link
              href={`/doctor/workspace/${apt.id}`}
              className="px-4 py-2 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
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
