import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import { getClinicById, getDoctors } from "@/lib/data";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Car,
  Accessibility,
  CheckCircle2,
  Calendar,
  Star,
  ChevronRight,
  ArrowRight,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default async function ClinicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clinic = getClinicById(id);

  if (!clinic) {
    notFound();
  }

  const doctors = getDoctors({ clinicId: clinic.id });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F5] text-vela-ink">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-vela-muted">
          <Link href="/" className="hover:text-vela-forest transition">Home</Link>
          <span>/</span>
          <Link href="/clinics" className="hover:text-vela-forest transition">Clinics</Link>
          <span>/</span>
          <span className="text-vela-ink font-semibold">{clinic.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Banner & Image */}
            <div className="bg-white rounded-card overflow-hidden border border-[#E2E8E4] shadow-sm">
              <div className="relative h-72 sm:h-80">
                <img
                  src={clinic.imageUrl}
                  alt={clinic.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>San Francisco Care Center</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    {clinic.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1.5">
                    <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.postalCode}</span>
                  </p>
                </div>
              </div>

              {/* Quick Contact & Hours */}
              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E2E8E4] text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-vela-ink block">Hours of Operation</span>
                    <span className="text-vela-muted">{clinic.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-vela-ink block">Facility Telephone</span>
                    <span className="text-vela-muted">{clinic.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-vela-ink block">Direct Inquiries</span>
                    <span className="text-vela-muted">{clinic.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility & Parking Details */}
            <div className="bg-white rounded-card p-5 sm:p-6 border border-[#E2E8E4] shadow-sm">
              <h2 className="text-base font-bold text-vela-ink tracking-tight mb-4">
                Access, Parking & Facility Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] flex items-start gap-3">
                  <Car className="w-5 h-5 text-vela-sage shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-vela-ink mb-1">Parking & Transit</h4>
                    <p className="text-xs text-vela-muted leading-relaxed">{clinic.parkingInfo}</p>
                  </div>
                </div>

                <div className="p-4 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] flex items-start gap-3">
                  <Accessibility className="w-5 h-5 text-vela-sage shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-vela-ink mb-1">Accessibility Standards</h4>
                    <p className="text-xs text-vela-muted leading-relaxed">{clinic.accessibilityInfo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinicians at this Facility */}
            <div className="bg-white rounded-card p-5 sm:p-6 border border-[#E2E8E4] shadow-sm">
              <h2 className="text-base font-bold text-vela-ink tracking-tight mb-4">
                Practicing Physicians at this Facility
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.userId}
                    className="p-4 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] flex items-center justify-between gap-3 hover:border-vela-sage/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.user?.avatarUrl}
                        alt={doc.user?.firstName}
                        className="w-11 h-11 rounded-xl object-cover border border-[#E2E8E4]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-vela-ink">
                          Dr. {doc.user?.firstName} {doc.user?.lastName}
                        </h4>
                        <span className="text-[11px] text-vela-sage font-medium block">{doc.specialtyName}</span>
                        <div className="flex items-center gap-1 text-[10px] text-vela-muted mt-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/book?doctorId=${doc.userId}&clinicId=${clinic.id}`}
                      className="px-3.5 py-1.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-semibold shadow-sm transition"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column / Sticky CTA */}
          <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-vela-forest bg-[#EFF2EF] px-2.5 py-1 rounded-pill inline-block mb-3 border border-[#E2E8E4]">
                Walk-ins & Scheduled Visits
              </span>
              <h3 className="text-lg font-bold text-vela-ink tracking-tight">
                Visit {clinic.name}
              </h3>
              <p className="text-xs text-vela-muted mt-1.5 leading-relaxed">
                Digital check-in active. Arrival within 20 minutes automatically alerts our triage desk for immediate priority routing.
              </p>

              <hr className="my-4 border-[#E2E8E4]" />

              <Link
                href={`/book?clinicId=${clinic.id}`}
                className="w-full py-3 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 mb-2.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment at Facility</span>
              </Link>

              <Link
                href="/find-care"
                className="w-full py-2.5 rounded-button bg-vela-surfaceSubtle hover:bg-[#E2E8E4] text-vela-ink font-semibold text-xs transition text-center block"
              >
                View on Care Map
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
