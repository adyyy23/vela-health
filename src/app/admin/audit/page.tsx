"use client";

import React, { useState, useEffect } from "react";
import { AuditLog } from "@/types";
import { ShieldCheck, Search, Clock, User, Terminal } from "lucide-react";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "aud-1",
      userName: "Sarah Jenkins (Admin)",
      action: "FACILITY_PARAMETER_UPDATE",
      resource: "CLINIC:clinic-central",
      details: "Operating hours adjusted for Saturday clinic coverage.",
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "aud-2",
      userName: "Maria Santos (Patient)",
      action: "DIGITAL_CHECK_IN",
      resource: "APPOINTMENT:apt-today-1",
      details: "Verified check-in executed via PWA. Reception notified.",
      ipAddress: "172.56.21.90",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: "aud-3",
      userName: "Dr. Elena Reyes",
      action: "CLINICAL_WORKSPACE_SAVE",
      resource: "APPOINTMENT:apt-past-1",
      details: "Visit summary finalized and electronic prescription issued.",
      ipAddress: "192.168.1.42",
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      id: "aud-4",
      userName: "Sarah Jenkins (Admin)",
      action: "SYSTEM_INITIALIZE",
      resource: "DATABASE",
      details: "Initial cryptographic security schema initialized.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      (l.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
              Security Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Administrative Audit Log
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable logging of all privilege changes, digital check-ins, and consultation updates.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-bubble border border-slate-200/90 shadow-bubble overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Actor / User</th>
              <th className="px-5 py-3.5">Action Executed</th>
              <th className="px-5 py-3.5">Target Resource</th>
              <th className="px-5 py-3.5">Details</th>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition">
                <td className="px-5 py-3.5 font-bold text-slate-900">{l.userName}</td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {l.action}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-sky-700">{l.resource}</td>
                <td className="px-5 py-3.5 max-w-xs">{l.details}</td>
                <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                  {new Date(l.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">{l.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
