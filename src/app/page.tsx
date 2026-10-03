import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import VelaLogo from "@/components/VelaLogo";
import { getAllClinics, getDoctors, getAllSpecialties } from "@/lib/data";
import { CARE_FINDER_CATEGORIES } from "@/lib/constants";
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Video,
  ChevronRight,
  Star,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Baby,
  Smile,
  Activity,
  Eye,
} from "lucide-react";

export default function HomePage() {
  const clinics = getAllClinics();
  const doctors = getDoctors().slice(0, 4);
  const specialties = getAllSpecialties();

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF3F8]">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="pt-6 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Search Interface */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-sm w-max text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Modern Care Network • 4 San Francisco Centers Open Today</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Healthcare designed around where and how you live.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Find verified clinicians, compare neighborhood clinics, book instant in-person or telehealth visits, and follow your care stream on any device.
            </p>

            {/* Location-Aware Discovery Search Box */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                {/* Search input */}
                <div className="sm:col-span-7 relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Doctor, specialty, clinic, or symptom..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  />
                </div>

                {/* Location selector */}
                <div className="sm:col-span-5 relative flex items-center">
                  <MapPin className="w-4 h-4 text-sky-600 absolute left-3.5 pointer-events-none" />
                  <select className="w-full pl-10 pr-8 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white appearance-none cursor-pointer">
                    <option>San Francisco, CA (All)</option>
                    <option>Central Pavilion (Sutter St)</option>
                    <option>Mission Bay Hub</option>
                    <option>Marina Wellness Studio</option>
                    <option>Pacific Heights Suite</option>
                  </select>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Quick filters:</span>
                  <Link
                    href="/doctors?specialtyId=spec-derma"
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    Dermatology
                  </Link>
                  <Link
                    href="/doctors?specialtyId=spec-cardio"
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    Cardiology
                  </Link>
                  <Link
                    href="/find-care?available=today"
                    className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60"
                  >
                    Available Today
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/find-care"
                    className="px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition inline-flex items-center gap-1.5"
                  >
                    <span>Find Care</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/book"
                    className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition inline-flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Clinic Card & Visual Map Snapshot */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-bubble overflow-hidden border border-slate-200/90 bg-white shadow-floating p-2">
              {/* Top Banner Image with Map Pin Overlap */}
              <div className="relative h-64 rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                  alt="Vela Central Pavilion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                {/* Overlap Status Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Available Today: 10:30 AM & 2:00 PM</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-300">
                    Flagship Facility
                  </span>
                  <h3 className="text-xl font-bold tracking-tight">Vela Central Pavilion</h3>
                  <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    450 Sutter St, Suite 800 • San Francisco, CA
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Doctors Card inside */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Clinicians On Duty
                  </span>
                  <Link
                    href="/clinics/clinic-central"
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>View Facility</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"
                      alt="Dr. Elena Reyes"
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900">Dr. Elena Reyes, MD</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      </div>
                      <p className="text-[11px] text-slate-500">Dermatology • Stanford Medicine</p>
                    </div>
                  </div>
                  <Link
                    href="/book?doctorId=usr-doc-1"
                    className="text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-1.5 rounded-full shadow-sm"
                  >
                    Book
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs font-medium text-slate-700 pt-1">
                  <div className="bg-slate-100/70 p-2.5 rounded-2xl">
                    <span className="block text-slate-400 text-[10px] font-semibold uppercase">Consultation</span>
                    <span className="font-bold text-slate-900 text-sm">In-Person & Tele</span>
                  </div>
                  <div className="bg-slate-100/70 p-2.5 rounded-2xl">
                    <span className="block text-slate-400 text-[10px] font-semibold uppercase">Patient Rating</span>
                    <span className="font-bold text-slate-900 text-sm">4.96 ★ (148 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNIQUE GUIDED CARE FINDER HIGHLIGHT */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-bubble p-6 sm:p-10 border border-slate-200/90 shadow-bubble">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-3 border border-sky-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Discovery Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Not sure which specialist you need?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Tell us what kind of care you are looking for. We will guide you to the right clinical department without medical guesswork.
            </p>
          </div>

          {/* Care Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {CARE_FINDER_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/care-finder?category=${cat.id}`}
                className="group p-4 rounded-3xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200/80 hover:border-sky-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 mb-3 group-hover:scale-105 transition">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-sky-600">
                  <span>Explore Specialists</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Navigation and discovery assistance only — not medical diagnosis.</span>
            <Link
              href="/care-finder"
              className="font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              <span>Open Guided Care Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* NEARBY CLINICS SECTION */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Connected Healthcare Hubs
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              San Francisco Clinic Network
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Four state-of-the-art facilities equipped with unified digital check-in and accredited diagnostic labs.
            </p>
          </div>
          <Link
            href="/find-care"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/90 shadow-sm transition inline-flex items-center gap-1.5"
          >
            <span>Interactive Map View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={clinic.imageUrl}
                    alt={clinic.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Open Today</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-base">{clinic.name}</h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{clinic.address}, {clinic.city}</span>
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{clinic.operatingHours.split("|")[0]}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/clinics/${clinic.id}`}
                  className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-bold border border-slate-200/80 transition flex items-center justify-center gap-1"
                >
                  <span>Facility Details & Doctors</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Verified Medical Specialists
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Consult with top practitioners
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Board-certified specialists with real calendar availability and transparent consultation options.
            </p>
          </div>
          <Link
            href="/doctors"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/90 shadow-sm transition inline-flex items-center gap-1.5"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doc) => (
            <div
              key={doc.userId}
              className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-3">
                  <img
                    src={doc.user?.avatarUrl}
                    alt={doc.user?.firstName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{doc.rating} ({doc.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Dr. {doc.user?.firstName} {doc.user?.lastName}
                  </h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                </div>

                <p className="text-xs font-semibold text-sky-600 mt-0.5">{doc.specialtyName}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{doc.bio}</p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <span>Next Available:</span>
                  <span className="font-bold text-emerald-600">Today</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/doctors/${doc.userId}`}
                  className="flex-1 py-2 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                >
                  Profile
                </Link>
                <Link
                  href={`/book?doctorId=${doc.userId}`}
                  className="flex-1 py-2 text-center rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  Book Visit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW BOOKING WORKS */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900 text-white rounded-bubble p-8 sm:p-12 shadow-floating">
          <div className="max-w-xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Effortless Patient Journey
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              How appointment booking works with Vela
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              No endless phone queues or mystery confirmations. Everything updates in your personal care stream.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/70 border border-slate-700/80 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-sky-400 mb-4 block">01</span>
                <h3 className="text-lg font-bold text-white">Find Doctor & Clinic</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Filter by specialty, language, or location. View real photos, verified credentials, and authentic patient reviews.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-sky-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Real-time availability</span>
              </div>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-sky-400 mb-4 block">02</span>
                <h3 className="text-lg font-bold text-white">Instant Confirmation</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Choose in-person or secure telehealth. Get an official reference number and calendar invite in seconds.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-sky-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>No double-bookings</span>
              </div>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-sky-400 mb-4 block">03</span>
                <h3 className="text-lg font-bold text-white">Digital Check-In & Care Stream</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Check in from your phone as you approach the clinic. Access your clinical notes, prescriptions, and direct messaging after.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-sky-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero paperwork delays</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Common questions about care at Vela
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              Can I book without creating an account first?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              You can search clinicians, browse clinic amenities, and select your preferred schedule as a guest. When confirming your booking, you can quickly register or sign in with your phone or email.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              How does Digital Check-In work?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              20 minutes before your in-person appointment, a Digital Check-In button activates on your mobile screen. Once you tap it, your doctor is notified and you receive instructions directly directing you to your designated reception area.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              What if my doctor has no slots available on my preferred date?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              You can join the automated Waitlist directly on their profile. If another patient reschedules, our platform instantly offers the opening to waitlisted patients.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <VelaLogo size="md" inverted />
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Integrated modern healthcare discovery, smart appointment scheduling, and collaborative clinical workflows.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Discover Care
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link href="/find-care" className="hover:text-white transition">Find Care Near You</Link>
              <Link href="/doctors" className="hover:text-white transition">Specialist Directory</Link>
              <Link href="/clinics" className="hover:text-white transition">Clinic Facilities</Link>
              <Link href="/care-finder" className="hover:text-white transition">Guided Care Finder</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Portals
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link href="/patient" className="hover:text-white transition">Patient Mobile App</Link>
              <Link href="/doctor" className="hover:text-white transition">Doctor Clinical Portal</Link>
              <Link href="/admin" className="hover:text-white transition">Admin Operations Board</Link>
              <Link href="/login" className="hover:text-white transition">Account Access</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Clinic Contact
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flagship: 450 Sutter St, Suite 800<br />
              San Francisco, CA 94108<br />
              Direct: (415) 890-4100<br />
              Email: care@velahealth.com
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 Vela Health Systems Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-400">Terms of Care</Link>
            <Link href="/" className="hover:text-slate-400">Security Standards</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
