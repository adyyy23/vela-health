"use client";

import React, { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { CARE_FINDER_CATEGORIES, CareCategory } from "@/lib/constants";
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  Stethoscope,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CareFinderPage() {
  const [selectedCategory, setSelectedCategory] = useState<CareCategory>(CARE_FINDER_CATEGORIES[1]); // Default Skin/Derma

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F5] text-vela-ink">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Header with Explicit Medical Framing Disclaimer */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8E4] shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF2EF] text-vela-sage text-xs font-bold mb-3 border border-[#E2E8E4]">
                <Sparkles className="w-3.5 h-3.5 text-vela-sage" />
                <span>Guided Discovery Tool</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-vela-ink tracking-tight">
                What kind of care are you looking for?
              </h1>
              <p className="text-sm text-vela-muted mt-2 max-w-2xl leading-relaxed">
                Choose a health concern below to quickly identify the corresponding specialty, view affiliated doctors, and verify appointment openings across our San Francisco clinics.
              </p>
            </div>

            {/* Disclaimer pill */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 max-w-sm shrink-0">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-tight">
                  <strong className="font-semibold">Discovery Assistance Only:</strong> This tool assists with specialty navigation. It is not an algorithmic symptom checker or medical diagnosis. In an emergency, dial 911 immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Guided Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Category Selection */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-vela-muted px-1">
              Select Your Area of Concern
            </h2>

            <div className="flex flex-col gap-2.5">
              {CARE_FINDER_CATEGORIES.map((cat) => {
                const isSelected = cat.id === selectedCategory.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border flex items-center justify-between group ${
                      isSelected
                        ? "bg-white border-vela-sage shadow-sm ring-2 ring-vela-sage/20"
                        : "bg-white/90 hover:bg-white border-[#E2E8E4] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                          isSelected ? "bg-vela-sage text-white" : "bg-[#EFF2EF] text-vela-muted"
                        }`}
                      >
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold ${isSelected ? "text-vela-forest" : "text-vela-ink"}`}>
                          {cat.title}
                        </h3>
                        <span className="text-[11px] text-vela-muted line-clamp-1">
                          {cat.commonSymptoms.join(" • ")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-vela-sage translate-x-1" : "text-vela-muted group-hover:text-vela-ink"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Matched Specialty & Recommendation Surface */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
            <div className="border-b border-[#E2E8E4] pb-6 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage">
                Recommended Department & Clinical Focus
              </span>
              <h2 className="text-2xl font-extrabold text-vela-ink tracking-tight mt-1">
                {selectedCategory.title}
              </h2>
              <p className="text-sm text-vela-muted mt-2 leading-relaxed">
                {selectedCategory.description}
              </p>
            </div>

            {/* Typical symptoms list */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-vela-muted block mb-3">
                Common Reasons to Consult
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.commonSymptoms.map((symp, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-[#EFF2EF] text-vela-ink text-xs font-medium border border-[#E2E8E4]"
                  >
                    {symp}
                  </span>
                ))}
              </div>
            </div>

            {/* What to expect card */}
            <div className="bg-[#F7F9F7] border border-[#E2E8E4] rounded-2xl p-5 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-vela-forest mb-2.5">
                What to expect during your appointment
              </h4>
              <ul className="space-y-2 text-xs text-vela-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                  <span className="text-vela-ink">Comprehensive review of current symptoms and medical history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                  <span className="text-vela-ink">Targeted non-invasive examination with digital diagnostic tools.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-vela-sage shrink-0 mt-0.5" />
                  <span className="text-vela-ink">Instant e-prescription and personalized care plan uploaded to your Vela patient stream.</span>
                </li>
              </ul>
            </div>

            {/* Direct Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href={`/doctors?specialty=${selectedCategory.specialtySlug}`}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-2xl bg-vela-sage hover:bg-vela-sageDark text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>Browse {selectedCategory.title} Specialists</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/book?category=${selectedCategory.id}`}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-vela-forest hover:bg-black text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Specialty</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
