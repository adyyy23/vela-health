import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import {
  Sparkles,
  Stethoscope,
  Heart,
  Activity,
  Baby,
  Smile,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  Video,
  Building2,
} from "lucide-react";

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: "dermatology",
      title: "Dermatology & Skin Health",
      slug: "dermatology",
      description: "Full-body dermoscopy, acne treatment, mole mapping, eczema management, and non-invasive dermatological procedures.",
      treatments: [
        "Digital Mole & Lesion Scanning",
        "Targeted Acne & Rosacea Care",
        "Chronic Eczema & Psoriasis Management",
        "Biopsy & Minor Cryosurgery",
      ],
      leadPhysician: "Dr. Elena Reyes, MD",
      avgWaitTime: "Next Available Today",
      icon: Sparkles,
      color: "text-vela-sage",
      bg: "bg-[#EFF2EF]",
    },
    {
      id: "cardiology",
      title: "Cardiology & Vascular Medicine",
      slug: "cardiology",
      description: "Preventative cardiovascular screenings, ambulatory ECG analysis, lipid management, and hypertension protocols.",
      treatments: [
        "12-Lead Diagnostic Electrocardiograms",
        "Advanced Lipid Panel Analysis",
        "Holter & Continuous Rhythm Monitoring",
        "Hypertension Optimization Plans",
      ],
      leadPhysician: "Dr. Marcus Vance, MD",
      avgWaitTime: "Slots Available This Week",
      icon: Heart,
      color: "text-rose-700",
      bg: "bg-rose-50",
    },
    {
      id: "general",
      title: "Family & General Medicine",
      slug: "general-medicine",
      description: "Annual comprehensive physicals, metabolic panels, preventive adult screenings, and acute illness treatment.",
      treatments: [
        "Comprehensive Annual Wellness Exams",
        "Biometric & Metabolic Blood Panels",
        "Immunization & Travel Health Consults",
        "Acute Illness & Prescription Management",
      ],
      leadPhysician: "Dr. Sarah Lin, MD",
      avgWaitTime: "Walk-ins Welcome Daily",
      icon: Stethoscope,
      color: "text-vela-forest",
      bg: "bg-[#EFF2EF]",
    },
    {
      id: "pediatrics",
      title: "Pediatrics & Adolescent Care",
      slug: "pediatrics",
      description: "Developmental milestone assessments, pediatric vaccinations, childhood asthma support, and gentle pediatric triage.",
      treatments: [
        "Newborn & Well-Child Checkups",
        "State-Mandated Pediatric Immunizations",
        "Asthma & Childhood Allergy Plans",
        "Sports Physicals & School Clearance",
      ],
      leadPhysician: "Dr. James Wilson, MD",
      avgWaitTime: "Same-Day Priority Slots",
      icon: Baby,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      id: "womens-health",
      title: "Women's Health & OB-GYN",
      slug: "womens-health",
      description: "Annual pelvic health exams, cervical cancer screenings, hormone balance, and compassionate prenatal navigation.",
      treatments: [
        "Preventative Cervical & Breast Screenings",
        "Contraception Counseling & Placement",
        "Prenatal Care & First-Trimester Guidance",
        "Menopause & Hormonal Balance Management",
      ],
      leadPhysician: "Dr. Chloe Zhang, MD",
      avgWaitTime: "Slots Available Tomorrow",
      icon: Activity,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      id: "mental-health",
      title: "Mental & Behavioral Health",
      slug: "mental-health",
      description: "Empathetic cognitive behavioral therapy, anxiety protocols, sleep rhythm coaching, and psychiatric medication support.",
      treatments: [
        "Confidential 1-on-1 Cognitive Therapy",
        "Anxiety & Mood Disorder Protocol",
        "Burnout & Sleep Restoration Coaching",
        "Safe Psychiatric Medication Reviews",
      ],
      leadPhysician: "Dr. Jonathan Hayes, PsyD",
      avgWaitTime: "Telehealth Slots Available Daily",
      icon: Smile,
      color: "text-teal-700",
      bg: "bg-teal-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F5] text-vela-ink">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-white rounded-card p-6 sm:p-10 border border-[#E2E8E4] shadow-sm mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-[#EFF2EF] text-vela-sage text-xs font-bold mb-3 border border-[#E2E8E4]">
              <ShieldCheck className="w-3.5 h-3.5 text-vela-sage" />
              <span>San Francisco Clinical Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-vela-ink tracking-tight leading-tight">
              Comprehensive Clinical Services & Specialty Departments
            </h1>
            <p className="text-xs sm:text-sm text-vela-muted mt-2 leading-relaxed">
              Every Vela service is delivered by board-certified specialists equipped with connected digital diagnostics, instant e-prescriptions, and continuous care tracking.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/care-finder"
                className="px-4 py-2.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Need help choosing? Try Care Finder</span>
              </Link>
              <Link
                href="/find-care"
                className="px-4 py-2.5 rounded-button bg-vela-surfaceSubtle hover:bg-[#E2E8E4] text-vela-ink font-semibold text-xs transition inline-flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-vela-sage" />
                <span>View Clinics Map</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-card p-5 sm:p-6 border border-[#E2E8E4] shadow-sm hover:shadow transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl ${service.bg} ${service.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-vela-forest bg-[#EFF2EF] px-2.5 py-1 rounded-pill border border-[#E2E8E4]">
                      {service.avgWaitTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-vela-ink tracking-tight mb-2 group-hover:text-vela-forest transition">
                    {service.title}
                  </h3>
                  <p className="text-xs text-vela-muted leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-5 border-t border-[#E2E8E4] pt-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-vela-muted block mb-1.5">
                      Key Diagnostic Capabilities
                    </span>
                    {service.treatments.map((treat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-vela-ink">
                        <CheckCircle2 className="w-3.5 h-3.5 text-vela-sage shrink-0 mt-0.5" />
                        <span>{treat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#E2E8E4] flex items-center gap-2">
                  <Link
                    href={`/doctors?specialty=${service.slug}`}
                    className="flex-1 py-2 rounded-button bg-vela-surfaceSubtle hover:bg-[#E2E8E4] text-vela-ink text-xs font-semibold text-center transition"
                  >
                    View Specialists
                  </Link>
                  <Link
                    href={`/book?specialty=spec-${service.id.slice(0, 5)}`}
                    className="flex-1 py-2 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-semibold text-center shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
