import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { Video, ShieldCheck, Clock, FileText, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function TelehealthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F5] text-vela-ink">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16 flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E2E8E4] shadow-sm mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF2EF] text-vela-sage text-xs font-bold mb-4 border border-[#E2E8E4]">
              <Video className="w-3.5 h-3.5 text-vela-sage" />
              <span>Virtual Care Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-vela-ink tracking-tight leading-tight">
              Clinician Consultations from Anywhere
            </h1>
            <p className="text-sm sm:text-base text-vela-muted mt-3 leading-relaxed">
              Connect directly with board-certified physicians from your phone or desktop browser. No external application downloads required for encrypted audio/video consultations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/book?type=TELEHEALTH"
                className="px-6 py-3.5 rounded-2xl bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-sm shadow-sm transition inline-flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Book Telehealth Appointment</span>
              </Link>
              <Link
                href="/doctors?type=TELEHEALTH"
                className="px-5 py-3.5 rounded-2xl bg-[#EFF2EF] hover:bg-[#E2E8E4] text-vela-ink font-semibold text-xs transition"
              >
                Browse Telehealth Doctors
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-[#E2E8E4] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF2EF] text-vela-sage flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-vela-ink text-base">Encrypted Clinical Video</h3>
            <p className="text-xs text-vela-muted mt-2 leading-relaxed">
              Direct peer-to-peer browser video session strictly tied to your appointment token. No third-party accounts, plug-ins, or downloads required.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-[#E2E8E4] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF0EC] text-emerald-700 flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-vela-ink text-base">Instant e-Prescriptions</h3>
            <p className="text-xs text-vela-muted mt-2 leading-relaxed">
              Prescriptions, lab work orders, and physician visit summaries are automatically written to your Vela patient stream immediately upon consultation conclusion.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-[#E2E8E4] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-vela-ink text-base">Connected In-Clinic Transition</h3>
            <p className="text-xs text-vela-muted mt-2 leading-relaxed">
              If an in-person physical exam or biopsy is warranted, your physician can immediately escalate you to our San Francisco clinics without starting over.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
