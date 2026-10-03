"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Search, Phone, Mail, Calendar, FileText, ChevronRight } from "lucide-react";

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState("");

  const patients = [
    {
      id: "usr-patient-1",
      name: "Maria Clara Santos",
      dob: "Apr 18, 1995 (29y)",
      bloodType: "O+",
      phone: "+1 (415) 555-0142",
      email: "patient@velahealth.com",
      lastVisit: "Today • 10:30 AM (Follow-up)",
      condition: "Contact Dermatitis / Volar Forearm",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: "usr-patient-2",
      name: "David Kim",
      dob: "Sep 12, 1988 (38y)",
      bloodType: "A+",
      phone: "+1 (415) 555-0182",
      email: "david.kim@example.com",
      lastVisit: "Sep 24, 2026",
      condition: "Annual Skin Exam / Atypical Nevus",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: "usr-patient-3",
      name: "Chloe Vance",
      dob: "Jan 03, 1999 (27y)",
      bloodType: "B+",
      phone: "+1 (415) 555-0193",
      email: "chloe.vance@example.com",
      lastVisit: "Aug 15, 2026",
      condition: "Rosacea Management / Topical Azelaic Acid",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    },
  ];

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
              Active Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
              My Patient Directory
            </h1>
            <p className="text-xs text-vela-muted mt-1">
              Authorized patients under Dr. Reyes&apos; direct clinical care and follow-up.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-vela-muted absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 rounded-card bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-card p-5 border border-[#E2E8E4] shadow-sm flex flex-col justify-between hover:border-vela-sage/30 transition"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E2E8E4] shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-vela-ink">{patient.name}</h3>
                  <span className="text-[11px] text-vela-muted block">{patient.dob} • Blood: {patient.bloodType}</span>
                </div>
              </div>

              <div className="p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs space-y-1.5 mb-3">
                <div>
                  <span className="text-[10px] text-vela-muted font-bold uppercase block">Condition / Focus</span>
                  <span className="font-semibold text-vela-ink">{patient.condition}</span>
                </div>
                <div>
                  <span className="text-[10px] text-vela-muted font-bold uppercase block">Last Recorded Visit</span>
                  <span className="text-vela-sage font-medium">{patient.lastVisit}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
              <span className="text-[11px] text-vela-muted">{patient.phone}</span>
              <Link
                href={`/doctor/workspace/apt-today-1`}
                className="font-bold text-vela-sage hover:text-vela-sageDark flex items-center gap-0.5"
              >
                <span>Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
