"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import PublicNavbar from "@/components/PublicNavbar";
import { Clinic } from "@/types";
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Layers,
  List,
  Map as MapIcon,
  ChevronRight,
  Sparkles,
  X,
  Stethoscope,
  ExternalLink,
} from "lucide-react";

// Dynamic import with ssr: false for Leaflet
const CareMap = dynamic(() => import("@/components/CareMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
      Loading interactive care map...
    </div>
  ),
});

export default function FindCarePage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [viewMode, setViewMode] = useState<"MAP" | "LIST">("MAP");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clinics")
      .then((res) => res.json())
      .then((data) => {
        if (data.clinics) {
          setClinics(data.clinics);
          if (data.clinics.length > 0) {
            setSelectedClinic(data.clinics[0]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredClinics = clinics.filter((c) => {
    if (searchQuery.trim()) {
      const match =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="h-screen flex flex-col bg-[#EDF3F8] overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 relative flex overflow-hidden">
        {/* TOP FLOATING SEARCH & FILTER BAR */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-20 pointer-events-none flex justify-center">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.12)] p-2 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 max-w-5xl w-full">
            {/* Search */}
            <div className="flex-1 min-w-[220px] relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clinics, neighborhood, or address..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterTodayOnly(!filterTodayOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  filterTodayOnly
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Available Today
              </button>

              {/* View Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/60">
                <button
                  onClick={() => setViewMode("MAP")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    viewMode === "MAP" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setViewMode("LIST")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    viewMode === "LIST" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAP VIEW */}
        {viewMode === "MAP" && (
          <div className="w-full h-full relative">
            <CareMap
              clinics={filteredClinics}
              selectedClinicId={selectedClinic?.id}
              onSelectClinic={(c) => setSelectedClinic(c)}
              className="w-full h-full"
            />

            {/* FLOATING CLINIC PREVIEW BUBBLE (Reference Image Inspiration) */}
            {selectedClinic && (
              <div className="absolute bottom-6 inset-x-4 sm:left-8 sm:right-auto sm:w-[420px] z-30 pointer-events-auto animate-sheet-up">
                <div className="bg-white rounded-bubble p-5 border border-slate-200/90 shadow-floating relative">
                  <button
                    onClick={() => setSelectedClinic(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      Open Today • Walk-ins & Appointments
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{selectedClinic.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{selectedClinic.address}, {selectedClinic.city}</span>
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hours</span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {selectedClinic.operatingHours.split("|")[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Next Open Slot</span>
                      <span className="font-bold text-sky-700 block">{selectedClinic.nextAvailableSlot}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/clinics/${selectedClinic.id}`}
                      className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition flex items-center justify-center gap-1"
                    >
                      <span>Facility Info</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/book?clinicId=${selectedClinic.id}`}
                      className="flex-1 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold text-center shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book at Clinic</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === "LIST" && (
          <div className="w-full h-full overflow-y-auto pt-24 pb-12 px-4 sm:px-8 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              San Francisco Clinics ({filteredClinics.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-base">{clinic.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Open
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.postalCode}</span>
                    </p>

                    <div className="mt-3 flex flex-col gap-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{clinic.operatingHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{clinic.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      href={`/clinics/${clinic.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/book?clinicId=${clinic.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
