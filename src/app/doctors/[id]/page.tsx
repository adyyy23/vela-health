import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import { getDoctorById, getClinicById } from "@/lib/data";
import {
  Star,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  Clock,
  Video,
  ShieldCheck,
  Languages,
  Award,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = getDoctorById(id);

  if (!doctor) {
    notFound();
  }

  const clinic = doctor.clinicId ? getClinicById(doctor.clinicId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF3F8]">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/doctors" className="hover:text-slate-900">Doctors</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Dr. {doctor.user?.firstName} {doctor.user?.lastName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <img
                  src={doctor.user?.avatarUrl}
                  alt={doctor.user?.firstName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-slate-200 shadow-sm"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {doctor.specialtyName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified License: {doctor.licenseNumber}</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Dr. {doctor.user?.firstName} {doctor.user?.lastName}, MD
                  </h1>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Affiliated with <strong>{doctor.clinicName || "Vela Central Pavilion"}</strong></span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-400 font-normal">({doctor.reviewCount} patient reviews)</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600">
                      <Award className="w-4 h-4 text-sky-600" />
                      <span>{doctor.experienceYears} Years Clinical Practice</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600">
                      <Languages className="w-4 h-4 text-sky-600" />
                      <span>{doctor.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography & Approach */}
            <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-3">
                Physician Biography & Clinical Approach
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {doctor.bio}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Care Delivery Formats
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>In-Person Consultations at {doctor.clinicName}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-sky-600" />
                      <span>Secure Telehealth Video Appointments</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Practice Standards
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified CA Medical Board Licensure</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Same-Day Digital Visit Summary Delivery</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Services & Pricing */}
            <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
                Available Consultation Services
              </h2>
              <div className="flex flex-col gap-3">
                {doctor.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 transition flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{srv.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{srv.description}</p>
                      <span className="text-[11px] text-slate-400 mt-1 inline-block">
                        Duration: {srv.durationMinutes} minutes
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-slate-900">${srv.standardFee}</span>
                      <Link
                        href={`/book?doctorId=${doctor.userId}&serviceId=${srv.id}`}
                        className="block mt-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                      >
                        Select & Book →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Reviews */}
            <div className="bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Verified Patient Feedback
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reviews can only be submitted following a completed consultation.
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-base">{doctor.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Average Rating</span>
                </div>
              </div>

              {doctor.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No public reviews submitted yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {doctor.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{rev.patientName}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.doctorRating ? "text-amber-500 fill-amber-500" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        Verified Consultation • {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Booking Card (Col 4) */}
          <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-bubble p-6 border border-slate-200/90 shadow-bubble">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Direct Appointment Booking
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Schedule with Dr. {doctor.user?.lastName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Standard Consultation: <strong>${doctor.consultationFee}</strong>
              </p>

              <hr className="my-4 border-slate-100" />

              <div className="space-y-3 mb-6 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Next Opening:</span>
                  <span className="font-bold text-emerald-600">Today at 2:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Facility:</span>
                  <span className="font-semibold text-slate-800">{doctor.clinicName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cancellation:</span>
                  <span className="text-slate-600">Free up to 2 hours before</span>
                </div>
              </div>

              <Link
                href={`/book?doctorId=${doctor.userId}`}
                className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mb-2.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Now</span>
              </Link>

              <Link
                href={`/book?doctorId=${doctor.userId}&waitlist=true`}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition text-center block"
              >
                Join Cancellation Waitlist
              </Link>
            </div>

            {/* Clinic Info Preview Card */}
            {clinic && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Clinic Location
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{clinic.name}</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{clinic.address}, {clinic.city}</span>
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{clinic.phone}</span>
                  <Link href={`/clinics/${clinic.id}`} className="font-semibold text-sky-600 hover:text-sky-700">
                    Clinic Details →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
