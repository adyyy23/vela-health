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
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E4] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
            Credentialing & Privileges
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
            Medical Staff Oversight
          </h1>
          <p className="text-xs text-vela-muted mt-1">
            Manage board certifications, facility privileges, and active practitioner status.
          </p>
        </div>

        <button
          onClick={() => alert("Doctor application review and credentialing modal")}
          className="px-5 py-2.5 rounded-xl bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Credential New Clinician</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {doctors.map((doc) => (
          <div
            key={doc.userId}
            className="bg-white rounded-3xl p-6 border border-[#E2E8E4] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.user?.avatarUrl}
                    alt={doc.user?.firstName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#E2E8E4]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-vela-ink">
                      Dr. {doc.user?.firstName} {doc.user?.lastName}, MD
                    </h3>
                    <span className="text-xs text-vela-sage font-semibold block">{doc.specialtyName}</span>
                    <span className="text-[11px] text-vela-muted">{doc.clinicName}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    doc.isActive
                      ? "bg-[#EAF0EC] text-emerald-800 border-emerald-200"
                      : "bg-[#EFF2EF] text-vela-muted border-[#E2E8E4]"
                  }`}
                >
                  {doc.isActive ? "Active Staff" : "Inactive"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F9F7] border border-[#E2E8E4] text-xs space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-vela-muted">CA Medical License:</span>
                  <span className="font-mono font-bold text-vela-forest">{doc.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vela-muted">Board Licensure:</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Verified Active</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vela-muted">Standard Consultation Fee:</span>
                  <span className="font-bold text-vela-forest">${doc.consultationFee}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
              <span className="text-vela-muted font-medium">Rating: {doc.rating} ★ ({doc.reviewCount})</span>
              <button
                onClick={() => toggleDoctorActive(doc.userId)}
                className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                  doc.isActive
                    ? "bg-[#EFF2EF] hover:bg-[#E2E8E4] text-vela-ink"
                    : "bg-emerald-700 text-white"
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
