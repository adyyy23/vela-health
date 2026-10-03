"use client";

import React, { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { CARE_FINDER_CATEGORIES, CareCategory } from "@/lib/constants";
import {
  Sparkles,
  ShieldAlert,
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
    <div className="min-h-screen flex flex-col bg-[#EDF3F8]">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Header with Explicit Medical Framing Disclaimer */}
        <div className="bg-white rounded-bubble p-6 sm:p-10 border border-slate-200/90 shadow-bubble mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-3 border border-sky-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guided Discovery Tool</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                What kind of care are you looking for?
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Choose a health concern below to quickly identify the corresponding specialty, view affiliated doctors, and verify appointment openings across our San Francisco clinics.
              </p>
            </div>

            {/* Disclaimer pill */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 max-w-sm shrink-0">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-tight">
                  <strong className="font-semibold">Discovery Assistance Only:</strong> This tool assists with specialty navigation. It is not an algorithmic symptom checker or a medical diagnosis. In an emergency, dial 911 immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Guided Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Category Selection */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Select Your Area of Concern
            </h2>

            <div className="flex flex-col gap-2.5">
              {CARE_FINDER_CATEGORIES.map((cat) => {
                const isSelected = cat.id === selectedCategory.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left p-4 rounded-3xl transition-all duration-200 border flex items-center justify-between group ${
                      isSelected
                        ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-200/60"
                        : "bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                          isSelected ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold ${isSelected ? "text-sky-900" : "text-slate-800"}`}>
                          {cat.title}
                        </h3>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {cat.commonSymptoms.join(" • ")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-sky-600 translate-x-1" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Matched Specialty & Recommendation Surface */}
          <div className="lg:col-span-7 bg-white rounded-bubble p-6 sm:p-8 border border-slate-200/90 shadow-bubble">
            <div className="border-b border-slate-100 pb-6 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                Recommended Department & Clinical Focus
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                {selectedCategory.title}
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {selectedCategory.description}
              </p>
            </div>

            {/* Typical symptoms list */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                Common Reasons to Consult
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.commonSymptoms.map((symp, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                  >
                    {symp}
                  </span>
                ))}
              </div>
            </div>

            {/* What to expect card */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-3xl p-5 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-2">
                What to expect during your appointment
              </h4>
              <ul className="space-y-2 text-xs text-sky-900">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>Comprehensive review of current symptoms and medical history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>Targeted non-invasive examination with digital diagnostic tools.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>Instant e-prescription and personalized care plan uploaded to your Vela patient stream.</span>
                </li>
              </ul>
            </div>

            {/* Direct Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href={`/doctors?specialty=${selectedCategory.specialtySlug}`}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>Browse {selectedCategory.title} Specialists</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/book?category=${selectedCategory.id}`}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2"
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
