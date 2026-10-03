"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import VelaLogo from "@/components/VelaLogo";
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Clock,
  Video,
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  Baby,
  Smile,
  Stethoscope,
  Building2,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("San Francisco, CA");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/find-care?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/find-care");
    }
  };

  const departments = [
    {
      title: "Primary & Family Medicine",
      desc: "Annual wellness physicals, adult screenings, chronic disease prevention, and acute care.",
      lead: "Dr. Sarah Lin, MD",
      nextSlot: "Available Today",
      link: "/doctors?specialty=spec-general",
    },
    {
      title: "Cardiology & Vascular",
      desc: "12-lead diagnostic ECGs, lipid panel profiling, continuous rhythm analysis, and hypertension plans.",
      lead: "Dr. Marcus Vance, MD",
      nextSlot: "Tomorrow Morning",
      link: "/doctors?specialty=spec-cardio",
    },
    {
      title: "Dermatology & Skin Health",
      desc: "Digital dermoscopy, full-body mole scans, targeted acne care, and biopsy procedures.",
      lead: "Dr. Elena Reyes, MD",
      nextSlot: "Today at 2:00 PM",
      link: "/doctors?specialty=spec-derma",
    },
    {
      title: "Pediatrics & Adolescent Care",
      desc: "Newborn checkups, developmental milestones, school sports clearances, and immunization.",
      lead: "Dr. James Wilson, MD",
      nextSlot: "Same-Day Priority",
      link: "/doctors?specialty=spec-pedia",
    },
    {
      title: "Women's Health & OB-GYN",
      desc: "Preventative cervical and pelvic health screenings, contraception, and hormone management.",
      lead: "Dr. Chloe Zhang, MD",
      nextSlot: "Slots This Week",
      link: "/doctors?specialty=spec-women",
    },
    {
      title: "Behavioral & Mental Health",
      desc: "Cognitive therapy, anxiety protocols, sleep rhythm coaching, and psychiatric medication reviews.",
      lead: "Dr. Jonathan Hayes, PsyD",
      nextSlot: "Telehealth Today",
      link: "/care-finder?category=care-mental",
    },
  ];

  const networkClinics = [
    {
      id: "clinic-central",
      name: "VELA Central Pavilion",
      address: "450 Sutter St, San Francisco, CA 94108",
      hours: "Mon–Fri: 07:30 – 19:30 • Sat: 08:30 – 14:00",
      transit: "Montgomery BART • Validated garage parking",
      leadDoc: "Dr. Elena Reyes, MD",
    },
    {
      id: "clinic-mission",
      name: "VELA Mission Bay Health Hub",
      address: "1500 Owens St, San Francisco, CA 94158",
      hours: "Mon–Fri: 08:00 – 18:00 • Sat: 09:00 – 13:00",
      transit: "Muni T-Line (Mission Bay) • On-site lot",
      leadDoc: "Dr. Marcus Vance, MD",
    },
    {
      id: "clinic-marina",
      name: "VELA Marina Wellness Studio",
      address: "2100 Chestnut St, San Francisco, CA 94123",
      hours: "Mon–Fri: 08:30 – 17:30",
      transit: "Muni 30 / 22 Chestnut • Street parking",
      leadDoc: "Dr. Sarah Lin, MD",
    },
    {
      id: "clinic-pacific",
      name: "VELA Pacific Heights Suite",
      address: "2340 Clay St, San Francisco, CA 94115",
      hours: "Mon–Fri: 09:00 – 17:00",
      transit: "Clay & Webster • Reserved patient bays",
      leadDoc: "Dr. James Wilson, MD",
    },
  ];

  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "You can book directly through our online scheduler or Care Finder. Select your specialty or clinic, choose your preferred physician, and pick an open time slot. You receive immediate confirmation and a reference token for digital check-in.",
    },
    {
      q: "What health insurance plans do you accept?",
      a: "VELA facilities accept major commercial health insurers (Blue Shield, Aetna, Cigna, UnitedHealthcare) and Medicare. Transparent self-pay rates are shown prior to confirmation for complete billing clarity.",
    },
    {
      q: "How does Digital Check-In work upon clinic arrival?",
      a: "20 minutes before your scheduled visit, a Digital Check-In button activates on your appointment screen. Tapping it signals our reception desk that you have arrived and directs you straight to your exam suite.",
    },
    {
      q: "Are virtual telehealth consultations supported?",
      a: "Yes. VELA provides encrypted, browser-based telehealth consultations with board-certified physicians. You can join with one click without downloading third-party software.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-vela-canvas text-vela-ink font-sans">
      <PublicNavbar />

      {/* ============================================================ */}
      {/* 1. TIGHT, EDITORIAL PUBLIC HERO */}
      {/* ============================================================ */}
      <section className="pt-5 pb-7 sm:pt-6 sm:pb-8 px-4 sm:px-6 max-w-6xl mx-auto w-full border-b border-vela-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Headline, Narrative & Search */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-vela-sage">
              <span className="w-1.5 h-1.5 rounded-full bg-vela-sage" />
              <span>Modern Care Network • 4 San Francisco Centers Open Today</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-vela-ink leading-[1.14]">
              Healthcare designed around where and how you live.
            </h1>

            <p className="text-xs sm:text-sm text-vela-muted max-w-xl leading-relaxed">
              Find verified clinicians, compare neighborhood clinics, book instant in-person or telehealth visits, and follow your care stream on any device.
            </p>

            {/* Compact Search & Filter Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-1 bg-white rounded-card p-1.5 sm:p-2 border border-vela-border shadow-vela-card flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5"
            >
              <div className="flex-1 relative flex items-center">
                <Search className="w-3.5 h-3.5 text-vela-muted absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Doctor, specialty, clinic, or concern..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs font-medium text-vela-ink bg-transparent focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="hidden sm:block w-px h-6 bg-vela-border" />

              <div className="sm:w-44 relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-vela-muted absolute left-2.5 pointer-events-none" />
                <select
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-7 pr-4 py-1.5 text-xs font-medium text-vela-ink bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="San Francisco, CA">San Francisco, CA (All)</option>
                  <option value="Downtown / Sutter">Downtown • 450 Sutter</option>
                  <option value="Mission Bay">Mission Bay • Owens St</option>
                  <option value="Marina">Marina • Chestnut St</option>
                  <option value="Pacific Heights">Pacific Heights • Clay St</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find Care</span>
              </button>
            </form>

            {/* Quick Context Filters */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-vela-muted pt-0.5">
              <span className="font-semibold text-vela-ink">Quick filters:</span>
              <Link
                href="/doctors?specialty=spec-derma"
                className="hover:text-vela-forest underline decoration-slate-300 underline-offset-2 transition"
              >
                Dermatology
              </Link>
              <span>•</span>
              <Link
                href="/doctors?specialty=spec-cardio"
                className="hover:text-vela-forest underline decoration-slate-300 underline-offset-2 transition"
              >
                Cardiology
              </Link>
              <span>•</span>
              <Link
                href="/find-care"
                className="hover:text-vela-forest underline decoration-slate-300 underline-offset-2 transition"
              >
                Available Today
              </Link>
              <span>•</span>
              <Link
                href="/telehealth"
                className="hover:text-vela-forest underline decoration-slate-300 underline-offset-2 transition"
              >
                Virtual Consults
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Healthcare Visual (Height-Constrained) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-card overflow-hidden border border-vela-border shadow-vela-card h-[220px] sm:h-[260px] lg:h-[275px] group">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                alt="VELA Central Pavilion"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* Contextual Status Badges */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-[6px] text-[10px] font-bold text-vela-forest shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Available Today • Open Now</span>
              </div>

              {/* Facility Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                    Flagship Center
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-sm">
                    VELA Central Pavilion
                  </h3>
                  <p className="text-[11px] text-slate-200 mt-0.5">
                    450 Sutter St • Walk-ins & Scheduled
                  </p>
                </div>

                <Link
                  href="/clinics/clinic-central"
                  className="px-2.5 py-1 rounded-[6px] bg-white text-vela-ink hover:bg-slate-100 text-[11px] font-bold shadow-sm transition shrink-0"
                >
                  View Clinic
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. DISCOVER SPECIALIZED CARE (Immediately Accessible) */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-2 border-b border-vela-border pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage block">
              Clinical Specialties
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-vela-ink tracking-tight mt-0.5">
              Discover specialized care
            </h2>
          </div>

          <Link
            href="/services"
            className="text-xs font-bold text-vela-sage hover:text-vela-sageDark inline-flex items-center gap-1 transition"
          >
            <span>View All Clinical Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Structured Clinical Departments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className="bg-white rounded-card p-4 sm:p-5 border border-vela-border shadow-vela-subtle hover:border-vela-sage/50 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-vela-muted mb-2">
                  <span className="font-semibold text-emerald-800 bg-[#EAF0EC] px-2 py-0.5 rounded-[5px]">
                    {dept.nextSlot}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">0{idx + 1}</span>
                </div>

                <h3 className="font-bold text-sm text-vela-ink group-hover:text-vela-forest transition">
                  {dept.title}
                </h3>
                <p className="text-xs text-vela-muted mt-1 leading-relaxed">
                  {dept.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-vela-border flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">{dept.lead}</span>
                <Link
                  href={dept.link}
                  className="font-bold text-vela-sage hover:text-vela-sageDark inline-flex items-center gap-1 transition"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SAN FRANCISCO CONNECTED FACILITIES */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-vela-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage block">
              Physical Locations
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-vela-ink tracking-tight mt-0.5">
              Four clinics connected across San Francisco
            </h2>
          </div>

          <Link
            href="/clinics"
            className="text-xs font-bold text-vela-sage hover:text-vela-sageDark inline-flex items-center gap-1 transition"
          >
            <span>Explore All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Clean Facility Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networkClinics.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-card p-4 sm:p-5 border border-vela-border shadow-vela-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-sm text-vela-ink">{c.name}</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-[#EAF0EC] px-2 py-0.5 rounded-[5px] shrink-0">
                    Open Today
                  </span>
                </div>

                <p className="text-xs text-vela-muted flex items-start gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-vela-sage shrink-0 mt-0.5" />
                  <span>{c.address}</span>
                </p>

                <div className="text-[11px] text-slate-500 space-y-1 bg-[#F7F9F7] p-2.5 rounded-lg border border-vela-border">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-vela-sage shrink-0" />
                    <span>{c.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-3 h-3 text-vela-sage shrink-0" />
                    <span>{c.transit}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-vela-border flex items-center gap-2">
                <Link
                  href={`/clinics/${c.id}`}
                  className="flex-1 py-2 rounded-button bg-vela-surfaceSubtle hover:bg-slate-200 text-vela-ink text-xs font-semibold text-center transition"
                >
                  Clinic Details
                </Link>
                <Link
                  href={`/book?clinicId=${c.id}`}
                  className="flex-1 py-2 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-bold text-center shadow-sm transition"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. EDITORIAL CLINICAL STANDARDS & ARCHITECTURE */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-vela-border">
        <div className="bg-white rounded-surface p-6 sm:p-8 border border-vela-border shadow-vela-subtle">
          <div className="max-w-2xl mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage block mb-1">
              Integrated System
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-vela-ink tracking-tight">
              A unified clinical ecosystem designed for real continuity.
            </h2>
            <p className="text-xs sm:text-sm text-vela-muted mt-1 leading-relaxed">
              VELA bridges discovery, in-person clinic visits, telehealth, and longitudinal records under one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-vela-border text-xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-vela-ink text-sm mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-vela-sage" />
                <span>Zero-Barrier Scheduling</span>
              </div>
              <p className="text-vela-muted leading-relaxed">
                Direct integration with doctor calendars. Automatic digital check-in on mobile 20 minutes prior to arrival.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-bold text-vela-ink text-sm mb-1.5">
                <Lock className="w-4 h-4 text-vela-sage" />
                <span>Encrypted Patient Stream</span>
              </div>
              <p className="text-vela-muted leading-relaxed">
                Diagnostic reports, electronic prescriptions, and SOAP summaries uploaded immediately to your patient portal.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-bold text-vela-ink text-sm mb-1.5">
                <Video className="w-4 h-4 text-vela-sage" />
                <span>Connected Virtual Care</span>
              </div>
              <p className="text-vela-muted leading-relaxed">
                Seamless handoff between remote telehealth visits and in-person San Francisco clinic exams without starting over.
              </p>
            </div>
          </div>

          {/* Operational Numbers Inline */}
          <div className="mt-6 pt-4 border-t border-vela-border flex flex-wrap items-center justify-between gap-4 text-xs text-vela-muted">
            <span className="font-medium">
              <strong className="text-vela-ink font-bold">2,500+</strong> Active Patient Panel
            </span>
            <span className="font-medium">
              <strong className="text-vela-ink font-bold">6.4 min</strong> Average Post-Check-In Wait Time
            </span>
            <span className="font-medium">
              <strong className="text-vela-ink font-bold">98.2%</strong> Verified Patient Satisfaction
            </span>
            <Link
              href="/register"
              className="text-xs font-bold text-vela-sage hover:text-vela-sageDark inline-flex items-center gap-1"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 max-w-3xl mx-auto w-full border-t border-vela-border">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-vela-ink tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-vela-muted mt-1">
            Common questions about care access, insurance, and clinical check-in.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-card border border-vela-border shadow-vela-subtle overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-bold text-vela-ink"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-vela-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-vela-muted shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 pt-1 text-xs text-vela-muted leading-relaxed border-t border-vela-borderLight">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CALL TO ACTION STRIP */}
      {/* ============================================================ */}
      <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="bg-vela-forest text-white rounded-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ready to schedule your appointment?
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Book online in under two minutes. Access digital check-in, visit summaries, and direct physician messaging.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/book"
              className="px-4 py-2.5 rounded-button bg-white hover:bg-slate-100 text-vela-forest font-bold text-xs shadow-sm transition"
            >
              Book Appointment
            </Link>
            <Link
              href="/care-finder"
              className="px-4 py-2.5 rounded-button bg-vela-forest hover:bg-black/50 text-white font-semibold text-xs border border-white/30 transition"
            >
              Care Finder
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. REFINED FOOTER */}
      {/* ============================================================ */}
      <footer className="mt-auto bg-white border-t border-vela-border py-6 px-4 sm:px-6 text-xs text-vela-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VelaLogo size="sm" />
            <span className="text-slate-300">|</span>
            <span>San Francisco Healthcare Network • HIPAA Compliant</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/find-care" className="hover:text-vela-ink transition">Find Care</Link>
            <Link href="/doctors" className="hover:text-vela-ink transition">Physicians</Link>
            <Link href="/clinics" className="hover:text-vela-ink transition">Clinics</Link>
            <Link href="/telehealth" className="hover:text-vela-ink transition">Telehealth</Link>
            <Link href="/login" className="hover:text-vela-ink transition">Portal Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
