"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { DoctorProfile, Specialty, Clinic } from "@/types";
import {
  Search,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  Video,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Languages,
} from "lucide-react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/doctors").then((r) => r.json()),
      fetch("/api/clinics").then((r) => r.json()),
    ]).then(([docData, clinicData]) => {
      if (docData.doctors) setDoctors(docData.doctors);
      if (clinicData.clinics) setClinics(clinicData.clinics);
      setLoading(false);
    });
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedSpecialty && doc.specialtyId !== selectedSpecialty) return false;
    if (selectedType === "TELEHEALTH" && !doc.telehealthAvailable) return false;
    if (selectedType === "IN_PERSON" && !doc.inPersonAvailable) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const match =
        doc.user?.firstName.toLowerCase().includes(term) ||
        doc.user?.lastName.toLowerCase().includes(term) ||
        doc.specialtyName?.toLowerCase().includes(term) ||
        doc.clinicName?.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-vela-canvas text-vela-ink">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Header Surface */}
        <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-vela-sage">
            Medical Staff Directory
          </span>
          <h1 className="text-3xl font-extrabold text-vela-ink tracking-tight mt-1">
            Verified Doctors & Specialists
          </h1>
          <p className="text-sm text-vela-muted mt-1 max-w-xl">
            Schedule direct in-person visits across our San Francisco clinics or connect instantly over HD telehealth.
          </p>

          {/* Filter Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative flex items-center">
              <Search className="w-4 h-4 text-vela-muted absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by physician name or specialty..."
                className="w-full pl-10 pr-4 py-2.5 rounded-card bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-card bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              >
                <option value="">All Specialties</option>
                <option value="spec-derma">Dermatology</option>
                <option value="spec-cardio">Cardiology</option>
                <option value="spec-general">Family Medicine</option>
                <option value="spec-pedia">Pediatrics</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-card bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              >
                <option value="">Any Consultation</option>
                <option value="IN_PERSON">In-Person Only</option>
                <option value="TELEHEALTH">Telehealth Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.userId}
              className="bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm flex flex-col justify-between group hover:border-vela-sage/40 transition"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={doc.user?.avatarUrl}
                    alt={doc.user?.firstName}
                    className="w-20 h-20 rounded-xl object-cover border border-[#E2E8E4] shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-base font-bold text-vela-ink">
                          Dr. {doc.user?.firstName} {doc.user?.lastName}, MD
                        </h2>
                        <CheckCircle2 className="w-4 h-4 text-vela-sage" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-vela-ink bg-amber-50 px-2 py-0.5 rounded-pill border border-amber-200/60">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{doc.rating}</span>
                        <span className="text-vela-muted font-normal">({doc.reviewCount})</span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-vela-sage block mt-0.5">
                      {doc.specialtyName}
                    </span>

                    <p className="text-xs text-vela-muted flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-vela-muted" />
                      <span>{doc.clinicName || "Vela Central Pavilion"}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-vela-muted mt-4 line-clamp-2 leading-relaxed">
                  {doc.bio}
                </p>

                {/* Badges / Languages */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-pill bg-vela-surfaceSubtle text-vela-muted">
                    <Languages className="w-3 h-3" />
                    <span>{doc.languages.join(", ")}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-pill bg-vela-surfaceSubtle text-vela-muted font-medium">
                    {doc.experienceYears} Years Clinical Exp
                  </span>

                  {doc.telehealthAvailable && (
                    <span className="px-2.5 py-1 rounded-pill bg-[#EAF0EC] text-vela-forest font-semibold border border-vela-sage/20 flex items-center gap-1">
                      <Video className="w-3 h-3 text-vela-sage" />
                      <span>Telehealth Available</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-6 pt-4 border-t border-[#E2E8E4] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-vela-muted uppercase font-semibold block">Consultation Fee</span>
                  <span className="text-sm font-bold text-vela-ink">${doc.consultationFee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/doctors/${doc.userId}`}
                    className="px-4 py-2 rounded-button bg-vela-surfaceSubtle hover:bg-[#EAF0EC] text-vela-ink text-xs font-semibold transition"
                  >
                    View Profile
                  </Link>

                  <Link
                    href={`/book?doctorId=${doc.userId}`}
                    className="px-5 py-2 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Schedule</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
