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
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
              Account Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Patient Account Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Account status, security authentications, and registration history (strictly privacy-guarded).
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-bubble border border-slate-200/90 shadow-bubble overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
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
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition">
                <td className="px-5 py-3.5 font-bold text-slate-900">{p.name}</td>
                <td className="px-5 py-3.5 text-slate-600">{p.email}</td>
                <td className="px-5 py-3.5 text-slate-600">{p.phone}</td>
                <td className="px-5 py-3.5">{p.address}</td>
                <td className="px-5 py-3.5 font-bold text-slate-900">{p.appointmentsCount} Visits</td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => alert(`Reset password link generated for ${p.email}`)}
                    className="font-bold text-sky-600 hover:text-sky-700 text-xs"
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
