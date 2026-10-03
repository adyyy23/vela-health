"use client";

import React, { useState } from "react";
import { Users, Search, ShieldCheck, Mail, Phone, Calendar, UserCheck } from "lucide-react";

export default function AdminPatientsPage() {
  const [search, setSearch] = useState("");

  const patientAccounts = [
    {
      id: "usr-patient-1",
      name: "Maria Clara Santos",
      email: "patient@velahealth.com",
      phone: "+1 (415) 555-0142",
      registeredDate: "Oct 2026",
      appointmentsCount: 3,
      status: "Active / Verified",
      address: "San Francisco, CA",
    },
    {
      id: "usr-patient-2",
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (415) 555-0182",
      registeredDate: "Sep 2026",
      appointmentsCount: 2,
      status: "Active / Verified",
      address: "San Francisco, CA",
    },
    {
      id: "usr-patient-3",
      name: "Chloe Vance",
      email: "chloe.vance@example.com",
      phone: "+1 (415) 555-0193",
      registeredDate: "Aug 2026",
      appointmentsCount: 1,
      status: "Active / Verified",
      address: "Oakland, CA",
    },
  ];

  const filtered = patientAccounts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
              Account Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
              Patient Account Management
            </h1>
            <p className="text-xs text-vela-muted mt-1">
              Account status, security authentications, and registration history (strictly privacy-guarded).
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-vela-muted absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F9F7] border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8E4] shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F9F7] border-b border-[#E2E8E4] text-vela-muted uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Patient Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Phone</th>
              <th className="px-5 py-3.5">City</th>
              <th className="px-5 py-3.5">Bookings</th>
              <th className="px-5 py-3.5">Account Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8E4] text-vela-ink">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F9F7]/70 transition">
                <td className="px-5 py-3.5 font-bold text-vela-ink">{p.name}</td>
                <td className="px-5 py-3.5 text-vela-muted">{p.email}</td>
                <td className="px-5 py-3.5 text-vela-muted">{p.phone}</td>
                <td className="px-5 py-3.5">{p.address}</td>
                <td className="px-5 py-3.5 font-bold text-vela-forest">{p.appointmentsCount} Visits</td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-[#EAF0EC] px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => alert(`Reset password link generated for ${p.email}`)}
                    className="font-bold text-vela-sage hover:text-vela-sageDark text-xs"
                  >
                    Reset Credentials
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
