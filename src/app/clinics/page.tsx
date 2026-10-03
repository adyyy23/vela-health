import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { getAllClinics } from "@/lib/data";
import { MapPin, Clock, Phone, ArrowRight, Building2, CheckCircle2 } from "lucide-react";

export default function ClinicsPage() {
  const clinics = getAllClinics();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F5] text-vela-ink">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Header Banner */}
        <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-[#EFF2EF] text-vela-sage text-xs font-bold mb-3 border border-[#E2E8E4]">
            <Building2 className="w-3.5 h-3.5 text-vela-sage" />
            <span>Connected Physical Facilities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
            Our San Francisco Healthcare Network
          </h1>
          <p className="text-xs sm:text-sm text-vela-muted mt-2 max-w-2xl leading-relaxed">
            Each Vela facility features zero-barrier accessibility, modern triage lounges, on-site diagnostics, and automated digital check-in directly synced with our clinical systems.
          </p>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-card overflow-hidden border border-[#E2E8E4] shadow-sm hover:shadow transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={clinic.imageUrl}
                    alt={clinic.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-pill text-[11px] font-bold text-vela-forest shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Open Today</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">San Francisco Care Center</span>
                    <h3 className="text-lg font-bold text-white drop-shadow-sm">{clinic.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-vela-muted flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                    <span className="text-vela-ink font-medium">{clinic.address}, {clinic.city}, {clinic.state} {clinic.postalCode}</span>
                  </p>

                  <div className="mt-4 flex flex-col gap-2 text-xs text-vela-muted bg-vela-surfaceSubtle p-3.5 rounded-button border border-[#E2E8E4]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-vela-sage shrink-0" />
                      <span className="text-vela-ink font-medium">{clinic.operatingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-vela-sage shrink-0" />
                      <span className="text-vela-ink font-medium">{clinic.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-3">
                <Link
                  href={`/clinics/${clinic.id}`}
                  className="flex-1 py-2.5 rounded-button bg-vela-surfaceSubtle hover:bg-[#E2E8E4] text-vela-ink text-xs font-bold text-center transition"
                >
                  View Facility & Doctors
                </Link>
                <Link
                  href={`/book?clinicId=${clinic.id}`}
                  className="flex-1 py-2.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-bold text-center shadow-sm transition"
                >
                  Book at Clinic
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
