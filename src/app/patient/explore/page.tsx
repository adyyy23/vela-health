"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Clinic, DoctorProfile } from "@/types";
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  Crosshair,
  Building2,
  Stethoscope,
  Star,
  X,
} from "lucide-react";

// Dynamic import with ssr: false for Leaflet
const CareMap = dynamic(() => import("@/components/CareMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
      Loading interactive map...
    </div>
  ),
});

export default function PatientExplorePage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [exploreTab, setExploreTab] = useState<"CLINICS" | "DOCTORS">("CLINICS");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState<string>("San Francisco, CA");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/clinics").then((r) => r.json()),
      fetch("/api/doctors").then((r) => r.json()),
    ]).then(([clinicData, docData]) => {
      if (clinicData.clinics) {
        setClinics(clinicData.clinics);
        if (clinicData.clinics.length > 0) setSelectedClinic(clinicData.clinics[0]);
      }
      if (docData.doctors) setDoctors(docData.doctors);
      setLoading(false);
    });
  }, []);

  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus("Current Location: Downtown SF");
        },
        (err) => {
          // Graceful fallback if permission denied!
          setLocationStatus("San Francisco, CA (Default)");
        }
      );
    } else {
      setLocationStatus("San Francisco, CA (Default)");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-68px)] flex flex-col overflow-hidden">
      {/* MAP BACKDROP (Top half / full background matching reference image) */}
      <div className="absolute inset-0 z-0">
        <CareMap
          clinics={clinics}
          selectedClinicId={selectedClinic?.id}
          onSelectClinic={(c) => setSelectedClinic(c)}
          className="w-full h-full"
        />
      </div>

      {/* FLOATING TOP LOCATION & SEARCH PILL OVER MAP */}
      <div className="relative z-10 p-4 pointer-events-none flex flex-col gap-2">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-card p-2.5 shadow-md border border-[#E2E8E4] flex items-center justify-between gap-2">
          <button
            onClick={handleUseLocation}
            className="flex items-center gap-1.5 text-xs font-semibold text-vela-ink hover:text-vela-sage transition"
          >
            <Crosshair className="w-3.5 h-3.5 text-vela-sage" />
            <span className="truncate max-w-[180px]">{locationStatus}</span>
          </button>

          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-pill border border-emerald-200">
            4 Clinics Open
          </span>
        </div>

        {/* Search input */}
        <div className="pointer-events-auto relative">
          <Search className="w-4 h-4 text-vela-muted absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clinics, doctors, or specialties..."
            className="w-full pl-10 pr-4 py-2.5 rounded-card bg-white/95 backdrop-blur-md border border-[#E2E8E4] shadow-md text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
          />
        </div>
      </div>

      {/* FLOATING BOTTOM SHEET OVER MAP (Direct Inspiration from Reference Image) */}
      <div className="mt-auto relative z-20 pointer-events-auto bg-white rounded-t-surface border-t border-[#E2E8E4] shadow-sheet p-5 pt-3 pb-8 max-h-[56vh] flex flex-col">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

        {/* Switch: Clinics / Doctors */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 bg-vela-surfaceSubtle p-1 rounded-card">
            <button
              onClick={() => setExploreTab("CLINICS")}
              className={`px-3 py-1 rounded-button text-xs font-bold transition ${
                exploreTab === "CLINICS" ? "bg-white text-vela-ink shadow-sm" : "text-vela-muted"
              }`}
            >
              Clinics ({clinics.length})
            </button>
            <button
              onClick={() => setExploreTab("DOCTORS")}
              className={`px-3 py-1 rounded-button text-xs font-bold transition ${
                exploreTab === "DOCTORS" ? "bg-white text-vela-ink shadow-sm" : "text-vela-muted"
              }`}
            >
              Specialists ({doctors.length})
            </button>
          </div>

          <span className="text-[11px] text-vela-muted font-medium">Near you</span>
        </div>

        {/* Scrollable list of items */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {exploreTab === "CLINICS" ? (
            clinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  className={`p-3.5 rounded-card border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#EAF0EC] border-vela-sage shadow-sm ring-1 ring-vela-sage/30"
                      : "bg-white hover:bg-vela-surfaceSubtle border-[#E2E8E4]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-vela-ink">{clinic.name}</h4>
                      <p className="text-[11px] text-vela-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-vela-sage shrink-0" />
                        <span>{clinic.address}</span>
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-pill border border-emerald-200 shrink-0">
                      Open
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-vela-sage">
                      Next: Available Today
                    </span>
                    <Link
                      href={`/book?clinicId=${clinic.id}`}
                      className="px-3.5 py-1.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-[11px] shadow-sm transition"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            doctors.map((doc) => (
              <div
                key={doc.userId}
                className="p-3.5 rounded-card bg-white border border-[#E2E8E4] flex items-center justify-between gap-3 hover:border-vela-sage/30 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doc.user?.avatarUrl}
                    alt={doc.user?.firstName}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E2E8E4]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-vela-ink">
                      Dr. {doc.user?.firstName} {doc.user?.lastName}
                    </h4>
                    <span className="text-[11px] text-vela-sage font-semibold block">{doc.specialtyName}</span>
                    <div className="flex items-center gap-1 text-[10px] text-vela-muted mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{doc.rating}</span>
                      <span>• Fee: ${doc.consultationFee}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/book?doctorId=${doc.userId}`}
                  className="px-3.5 py-1.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition"
                >
                  Book
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
