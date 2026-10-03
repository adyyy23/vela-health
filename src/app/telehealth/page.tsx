import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { Video, ShieldCheck, Clock, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export default function TelehealthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EDF3F8]">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex-1 w-full">
        <div className="bg-white rounded-bubble p-8 sm:p-12 border border-slate-200/90 shadow-bubble mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-2">
              Virtual Care Architecture
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Clinician Consultations from Anywhere
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Connect directly with board-certified physicians from your phone or browser. No app download required for audio/video consultations.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/book?type=TELEHEALTH"
                className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition inline-flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Book Telehealth Appointment</span>
              </Link>
              <Link
                href="/doctors?type=TELEHEALTH"
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
              >
                Browse Telehealth Doctors
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Encrypted Clinical Video</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Direct peer-to-peer browser video session strictly tied to your appointment token. No third-party accounts or downloads required.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant e-Prescriptions</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Prescriptions, lab work orders, and physician visit summaries are automatically written to your Vela patient stream upon conclusion.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Connected In-Clinic Transition</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              If an in-person physical exam or biopsy is warranted, your physician can immediately escalate you to our San Francisco clinics without starting over.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
