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
    <div className="w-full h-full flex items-center justify-center bg-[#EFF2EF] text-vela-muted text-xs">
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
    <div className="h-screen flex flex-col bg-[#F5F7F5] text-vela-ink overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 relative flex overflow-hidden">
        {/* TOP FLOATING SEARCH & FILTER BAR */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-20 pointer-events-none flex justify-center">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#E2E8E4] shadow-sm p-2 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 max-w-5xl w-full">
            {/* Search */}
            <div className="flex-1 min-w-[220px] relative flex items-center">
              <Search className="w-4 h-4 text-vela-muted absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clinics, neighborhood, or address..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterTodayOnly(!filterTodayOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  filterTodayOnly
                    ? "bg-[#EFF2EF] text-vela-forest border-[#CBD7CE]"
                    : "bg-[#F7F9F7] text-vela-muted border-[#E2E8E4] hover:bg-[#EFF2EF]"
                }`}
              >
                Available Today
              </button>

              {/* View Toggle */}
              <div className="bg-[#EFF2EF] p-1 rounded-xl flex items-center border border-[#E2E8E4]">
                <button
                  onClick={() => setViewMode("MAP")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    viewMode === "MAP" ? "bg-white text-vela-ink shadow-sm" : "text-vela-muted hover:text-vela-ink"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5 text-vela-sage" />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setViewMode("LIST")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    viewMode === "LIST" ? "bg-white text-vela-ink shadow-sm" : "text-vela-muted hover:text-vela-ink"
                  }`}
                >
                  <List className="w-3.5 h-3.5 text-vela-sage" />
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

            {/* FLOATING CLINIC PREVIEW BUBBLE */}
            {selectedClinic && (
              <div className="absolute bottom-6 inset-x-4 sm:left-8 sm:right-auto sm:w-[420px] z-30 pointer-events-auto animate-sheet-up">
                <div className="bg-white rounded-3xl p-5 border border-[#E2E8E4] shadow-lg relative">
                  <button
                    onClick={() => setSelectedClinic(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-vela-muted hover:text-vela-ink hover:bg-[#EFF2EF] transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-vela-forest uppercase tracking-wider">
                      Open Today • Walk-ins & Appointments
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-vela-ink">{selectedClinic.name}</h3>
                  <p className="text-xs text-vela-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-vela-sage shrink-0" />
                    <span>{selectedClinic.address}, {selectedClinic.city}</span>
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-[#F7F9F7] p-3 rounded-2xl border border-[#E2E8E4]">
                    <div>
                      <span className="text-[10px] text-vela-muted uppercase font-semibold block">Hours</span>
                      <span className="font-semibold text-vela-ink truncate block">
                        {selectedClinic.operatingHours.split("|")[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-vela-muted uppercase font-semibold block">Next Open Slot</span>
                      <span className="font-bold text-vela-forest block">{selectedClinic.nextAvailableSlot}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/clinics/${selectedClinic.id}`}
                      className="flex-1 py-2.5 rounded-2xl bg-[#EFF2EF] hover:bg-[#E2E8E4] text-vela-ink text-xs font-semibold text-center transition flex items-center justify-center gap-1"
                    >
                      <span>Facility Info</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/book?clinicId=${selectedClinic.id}`}
                      className="flex-1 py-2.5 rounded-2xl bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-semibold text-center shadow-sm transition flex items-center justify-center gap-1"
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
            <h2 className="text-xl font-bold text-vela-ink mb-4">
              San Francisco Clinics ({filteredClinics.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="bg-white rounded-3xl p-5 border border-[#E2E8E4] shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-vela-ink text-base">{clinic.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF2EF] text-vela-forest border border-[#E2E8E4]">
                        Open
                      </span>
                    </div>

                    <p className="text-xs text-vela-muted flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-vela-sage shrink-0 mt-0.5" />
                      <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.postalCode}</span>
                    </p>

                    <div className="mt-3 flex flex-col gap-1 text-xs text-vela-muted bg-[#F7F9F7] p-3 rounded-2xl border border-[#E2E8E4]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-vela-sage" />
                        <span className="text-vela-ink font-medium">{clinic.operatingHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-vela-sage" />
                        <span className="text-vela-ink font-medium">{clinic.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8E4] flex items-center gap-2">
                    <Link
                      href={`/clinics/${clinic.id}`}
                      className="flex-1 py-2.5 text-center rounded-xl bg-[#EFF2EF] hover:bg-[#E2E8E4] text-vela-ink text-xs font-semibold transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/book?clinicId=${clinic.id}`}
                      className="flex-1 py-2.5 text-center rounded-xl bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-semibold shadow-sm transition"
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
