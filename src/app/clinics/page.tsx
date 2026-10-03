import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { getAllClinics } from "@/lib/data";
import { MapPin, Clock, Phone, ArrowRight, ExternalLink } from "lucide-react";

export default function ClinicsPage() {
  const clinics = getAllClinics();

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF3F8]">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Connected Facilities
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Our San Francisco Healthcare Network
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Each Vela facility features zero-barrier accessibility, modern triage lounges, on-site diagnostics, and automated digital check-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-bubble overflow-hidden border border-slate-200/90 shadow-bubble flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56">
                  <img
                    src={clinic.imageUrl}
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
                    Open Today
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900">{clinic.name}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.postalCode}</span>
                  </p>

                  <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{clinic.operatingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{clinic.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center gap-3">
                <Link
                  href={`/clinics/${clinic.id}`}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition"
                >
                  View Amenities & Doctors
                </Link>
                <Link
                  href={`/book?clinicId=${clinic.id}`}
                  className="flex-1 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold text-center shadow-sm transition"
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
