"use client";

import React, { useState } from "react";
import { User, CheckCircle2, ShieldCheck, Building2, Languages, Award, Clock } from "lucide-react";

export default function DoctorProfilePage() {
  const [bio, setBio] = useState(
    "Dr. Elena Reyes is a board-certified dermatologist specializing in inflammatory skin disorders, photomedicine, and early detection of melanoma. She completed her residency at Stanford Medicine and brings 12 years of patient-centered clinical expertise."
  );
  const [fee, setFee] = useState("160");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&q=80"
              alt="Dr. Elena Reyes"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Dr. Elena Reyes, MD
                </h1>
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-xs text-sky-600 font-semibold">
                Dermatology & Cutaneous Surgery • Stanford Medicine
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">License: CA-MD-892147</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition"
          >
            Save Profile
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Doctor profile updated!</span>
        </div>
      )}

      <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble space-y-4 text-xs">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            Clinical Biography & Approach
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
              Standard Consultation Fee ($)
            </label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
              Primary Clinic Affiliation
            </label>
            <input
              type="text"
              disabled
              value="Vela Central Pavilion (Suite 800)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
