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
    <div className="min-h-screen flex flex-col bg-[#EDF3F8]">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/find-care" className="hover:text-slate-900">Clinics</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{clinic.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Banner & Image */}
            <div className="bg-white rounded-bubble overflow-hidden border border-slate-200/90 shadow-bubble">
              <div className="relative h-72 sm:h-96">
                <img
                  src={clinic.imageUrl}
                  alt={clinic.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                    San Francisco Care Center
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                    {clinic.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.postalCode}</span>
                  </p>
                </div>
              </div>

              {/* Quick Contact & Hours */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Hours of Operation</span>
                    <span className="text-slate-600">{clinic.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Facility Telephone</span>
                    <span className="text-slate-600">{clinic.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Inquiries</span>
                    <span className="text-slate-600">{clinic.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility & Parking Details */}
            <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
                Access, Parking & Facility Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  <Car className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Parking & Transit</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{clinic.parkingInfo}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  <Accessibility className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Accessibility Standards</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{clinic.accessibilityInfo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinicians at this Facility */}
            <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
                Practicing Physicians at this Facility
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.userId}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.user?.avatarUrl}
                        alt={doc.user?.firstName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Dr. {doc.user?.firstName} {doc.user?.lastName}
                        </h4>
                        <span className="text-[11px] text-sky-600 block">{doc.specialtyName}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/book?doctorId=${doc.userId}&clinicId=${clinic.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
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
            <div className="bg-white rounded-bubble p-6 border border-slate-200/90 shadow-bubble">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Walk-ins & Scheduled Visits
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Visit {clinic.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Digital check-in active. Arrival within 20 minutes automatically signals our reception team.
              </p>

              <hr className="my-4 border-slate-100" />

              <Link
                href={`/book?clinicId=${clinic.id}`}
                className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mb-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment at Facility</span>
              </Link>

              <Link
                href="/find-care"
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition text-center block"
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
