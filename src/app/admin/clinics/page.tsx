"use client";

import React, { useState, useEffect } from "react";
import { Clinic } from "@/types";
import { Building2, MapPin, Clock, Phone, Plus, CheckCircle2 } from "lucide-react";

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    fetch("/api/clinics")
      .then((r) => r.json())
      .then((data) => {
        if (data.clinics) setClinics(data.clinics);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E4] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
            Physical Facilities
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
            Clinic Facility Management
          </h1>
          <p className="text-xs text-vela-muted mt-1">
            Locations, coordinates, operating hours, and patient check-in zones across San Francisco.
          </p>
        </div>

        <button
          onClick={() => alert("Add clinic facility modal")}
          className="px-5 py-2.5 rounded-xl bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clinic Facility</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clinics.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border border-[#E2E8E4] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-base text-vela-ink">{c.name}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-[#EAF0EC] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Operational
                </span>
              </div>

              <p className="text-xs text-vela-muted flex items-start gap-1 mb-4">
                <MapPin className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                <span className="text-vela-ink">{c.address}, {c.city}, {c.state} {c.postalCode}</span>
              </p>

              <div className="p-3.5 rounded-2xl bg-[#F7F9F7] border border-[#E2E8E4] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-vela-muted">Phone:</span>
                  <span className="font-semibold text-vela-ink">{c.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vela-muted">Hours:</span>
                  <span className="font-semibold text-vela-ink truncate max-w-[200px]">{c.operatingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vela-muted">Coordinates:</span>
                  <span className="font-mono text-vela-forest">{c.latitude}, {c.longitude}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
              <span className="text-vela-muted">Check-in Zone: Reception Area B</span>
              <button
                onClick={() => alert("Facility parameters updated")}
                className="font-bold text-vela-sage hover:text-vela-sageDark"
              >
                Edit Facility →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
