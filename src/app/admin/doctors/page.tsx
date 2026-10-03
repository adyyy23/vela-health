"use client";

import React, { useState, useEffect } from "react";
import { DoctorProfile } from "@/types";
import { Stethoscope, CheckCircle2, ShieldCheck, Star, Building2, UserPlus } from "lucide-react";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((data) => {
        if (data.doctors) setDoctors(data.doctors);
        setLoading(false);
      });
  }, []);

  const toggleDoctorActive = (userId: string) => {
    setDoctors((prev) =>
      prev.map((d) => (d.userId === userId ? { ...d, isActive: !d.isActive } : d))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
            Credentialing & Privileges
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Medical Staff Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage board certifications, facility privileges, and active practitioner status.
          </p>
        </div>

        <button
          onClick={() => alert("Doctor application review and credentialing modal")}
          className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Credential New Clinician</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {doctors.map((doc) => (
          <div
            key={doc.userId}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.user?.avatarUrl}
                    alt={doc.user?.firstName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Dr. {doc.user?.firstName} {doc.user?.lastName}, MD
                    </h3>
                    <span className="text-xs text-sky-600 font-semibold block">{doc.specialtyName}</span>
                    <span className="text-[11px] text-slate-500">{doc.clinicName}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    doc.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {doc.isActive ? "Active Staff" : "Inactive"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">CA Medical License:</span>
                  <span className="font-mono font-bold text-slate-900">{doc.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Board Licensure:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Active</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard Consultation Fee:</span>
                  <span className="font-bold text-slate-900">${doc.consultationFee}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Rating: {doc.rating} ★ ({doc.reviewCount})</span>
              <button
                onClick={() => toggleDoctorActive(doc.userId)}
                className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                  doc.isActive
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {doc.isActive ? "Suspend Access" : "Activate Access"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
