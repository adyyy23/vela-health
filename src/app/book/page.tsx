"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import { DoctorProfile, Clinic, Specialty, ConsultationType } from "@/types";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Video,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  Hourglass,
} from "lucide-react";

function BookingFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step state (1 to 10)
  const [currentStep, setCurrentStep] = useState(1);

  // Data
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Selections
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(searchParams.get("specialty") || "spec-derma");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(searchParams.get("doctorId") || "");
  const [selectedClinicId, setSelectedClinicId] = useState<string>(searchParams.get("clinicId") || "");
  const [consultationType, setConsultationType] = useState<ConsultationType>(
    (searchParams.get("type") as ConsultationType) || "IN_PERSON"
  );
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");

  // States
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmationData, setConfirmationData] = useState<{
    appointmentId: string;
    referenceNo: string;
  } | null>(null);

  // Waitlist state
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Load initial data
  useEffect(() => {
    Promise.all([
      fetch("/api/doctors").then((r) => r.json()),
      fetch("/api/clinics").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ]).then(([docData, clinicData, authData]) => {
      if (docData.doctors) {
        setDoctors(docData.doctors);
        if (!selectedDoctorId && docData.doctors.length > 0) {
          const preselected = searchParams.get("doctorId");
          if (preselected) {
            setSelectedDoctorId(preselected);
          } else {
            setSelectedDoctorId(docData.doctors[0].userId);
          }
        }
      }
      if (clinicData.clinics) {
        setClinics(clinicData.clinics);
        if (!selectedClinicId && clinicData.clinics.length > 0) {
          setSelectedClinicId(clinicData.clinics[0].id);
        }
      }
      if (authData.user) {
        setCurrentUser(authData.user);
        setGuestName(`${authData.user.firstName} ${authData.user.lastName}`);
        setGuestEmail(authData.user.email);
        setGuestPhone(authData.user.phone || "");
      }
    });
  }, []);

  // Fetch slots whenever doctor, date, or type changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/availability?doctorId=${selectedDoctorId}&date=${selectedDate}&type=${consultationType}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.slots) {
          setAvailableSlots(data.slots);
          if (data.slots.length > 0) {
            setSelectedSlot(data.slots[0]);
          } else {
            setSelectedSlot("");
          }
        }
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDoctorId, selectedDate, consultationType]);

  const selectedDoctor = doctors.find((d) => d.userId === selectedDoctorId);
  const selectedClinic = clinics.find((c) => c.id === selectedClinicId);

  // Trigger celebration confetti on step 10 confirmation
  useEffect(() => {
    if (currentStep === 10) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0284C7", "#38BDF8", "#059669", "#FFFFFF"],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [currentStep]);

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setErrorMsg("");

    // If user is not logged in, auto-login as patient demo or register
    if (!currentUser) {
      // Login with demo patient or register guest
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "patient@velahealth.com", password: "PatientPass123!" }),
      });
      const loginData = await loginRes.json();
      if (!loginData.success) {
        setErrorMsg("Please sign in to confirm this appointment.");
        setSubmitting(false);
        return;
      }
    }

    // Submit appointment
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          clinicId: selectedClinicId,
          scheduledDate: selectedDate,
          scheduledTime: selectedSlot,
          consultationType,
          reason: reason || "Routine consultation and health review.",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || "Unable to complete booking. Please choose another slot.");
      } else {
        setConfirmationData({
          appointmentId: data.appointmentId,
          referenceNo: `VELA-${Math.floor(10000 + Math.random() * 90000)}`,
        });
        setCurrentStep(10); // Confirmed!
      }
    } catch (err: any) {
      setErrorMsg("Network error occurred during booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinWaitlist = async () => {
    try {
      // Auto login demo patient if guest
      if (!currentUser) {
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "patient@velahealth.com", password: "PatientPass123!" }),
        });
      }
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          preferredStartDate: selectedDate,
          preferredEndDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
          preferredTimeRange: "Morning (09:00 - 12:00)",
          notes: "Patient requested waitlist slot.",
        }),
      });
      setWaitlistSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF3F8]">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Progress Tracker */}
        {currentStep < 10 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Step {currentStep} of 9</span>
              <span className="text-slate-800">
                {currentStep === 1 && "Care Need"}
                {currentStep === 2 && "Select Clinician"}
                {currentStep === 3 && "Facility Location"}
                {currentStep === 4 && "Consultation Format"}
                {currentStep === 5 && "Choose Date"}
                {currentStep === 6 && "Available Time"}
                {currentStep === 7 && "Reason for Visit"}
                {currentStep === 8 && "Patient Details"}
                {currentStep === 9 && "Review & Schedule"}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Container Surface */}
        <div className="bg-white rounded-bubble p-6 sm:p-10 border border-slate-200/90 shadow-bubble">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: What care do you need? */}
          {currentStep === 1 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 1 • Care Requirement
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                What clinical care do you need?
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Choose the clinical focus area that best matches your health goals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: "spec-derma", title: "Dermatology & Skin Care", desc: "Acne, eczema, moles, lesions, barrier health" },
                  { id: "spec-cardio", title: "Cardiology & Vascular", desc: "Blood pressure, ECG, cholesterol, palpitations" },
                  { id: "spec-general", title: "Family & General Medicine", desc: "Annual physical, illness, routine checkups" },
                  { id: "spec-pedia", title: "Pediatrics & Child Wellness", desc: "Milestones, immunizations, childhood fever" },
                  { id: "spec-women", title: "Women's Health & OB-GYN", desc: "Preventative exam, cycle care, family planning" },
                  { id: "spec-mental", title: "Mental & Behavioral Health", desc: "Anxiety, mood, burnout, sleep therapy" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedSpecialty(item.id);
                      setCurrentStep(2);
                    }}
                    className={`p-4 rounded-3xl border text-left transition ${
                      selectedSpecialty === item.id
                        ? "bg-sky-50 border-sky-500 ring-2 ring-sky-200/60"
                        : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/80"
                    }`}
                  >
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Doctor */}
          {currentStep === 2 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 2 • Specialist
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Select your physician
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Showing verified practitioners affiliated with your selected specialty.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <button
                    key={doc.userId}
                    onClick={() => {
                      setSelectedDoctorId(doc.userId);
                      if (doc.clinicId) setSelectedClinicId(doc.clinicId);
                      setCurrentStep(3);
                    }}
                    className={`p-4 rounded-3xl border text-left flex items-start gap-3.5 transition ${
                      selectedDoctorId === doc.userId
                        ? "bg-sky-50 border-sky-500 ring-2 ring-sky-200/60"
                        : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/80"
                    }`}
                  >
                    <img
                      src={doc.user?.avatarUrl}
                      alt={doc.user?.firstName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900">
                          Dr. {doc.user?.firstName} {doc.user?.lastName}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      </div>
                      <span className="text-xs text-sky-600 font-semibold block">{doc.specialtyName}</span>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Fee: ${doc.consultationFee} • {doc.experienceYears}y exp
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Select Clinic */}
          {currentStep === 3 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 3 • Facility
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Select clinic location
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Choose a connected San Francisco facility for your records and check-in.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clinics.map((clinic) => (
                  <button
                    key={clinic.id}
                    onClick={() => {
                      setSelectedClinicId(clinic.id);
                      setCurrentStep(4);
                    }}
                    className={`p-4 rounded-3xl border text-left transition ${
                      selectedClinicId === clinic.id
                        ? "bg-sky-50 border-sky-500 ring-2 ring-sky-200/60"
                        : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/80"
                    }`}
                  >
                    <h4 className="font-bold text-sm text-slate-900">{clinic.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{clinic.address}</span>
                    </p>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-2">
                      Open Today • Validated Parking Available
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: In-Person / Telehealth */}
          {currentStep === 4 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 4 • Consultation Type
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                How would you like to consult?
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Both options include prescription handling and full clinical notes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setConsultationType("IN_PERSON");
                    setCurrentStep(5);
                  }}
                  className={`p-5 rounded-3xl border text-left transition ${
                    consultationType === "IN_PERSON"
                      ? "bg-sky-50 border-sky-500 ring-2 ring-sky-200/60"
                      : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/80"
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">In-Person Clinic Visit</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Visit {selectedClinic?.name}. Includes digital check-in on your phone upon arrival.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setConsultationType("TELEHEALTH");
                    setCurrentStep(5);
                  }}
                  className={`p-5 rounded-3xl border text-left transition ${
                    consultationType === "TELEHEALTH"
                      ? "bg-sky-50 border-sky-500 ring-2 ring-sky-200/60"
                      : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/80"
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 mb-3">
                    <Video className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Encrypted Telehealth</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct HD video consultation in your browser. Join with 1 click from your appointment screen.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Choose Date */}
          {currentStep === 5 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 5 • Date
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Select appointment date
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Pick an upcoming weekday. Real availability is checked dynamically.
              </p>

              <div className="max-w-md">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Continue to Timeslots →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Choose Available Time (Smart Scheduling Logic) */}
          {currentStep === 6 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 6 • Time Slot
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Choose available time
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Available slots for Dr. {selectedDoctor?.user?.lastName} on {selectedDate}.
              </p>

              {loadingSlots ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Checking clinician calendar and blocked slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center">
                  <p className="text-xs text-amber-800 font-semibold mb-3">
                    No open appointment slots remaining on this date.
                  </p>
                  {!waitlistSuccess ? (
                    <button
                      onClick={handleJoinWaitlist}
                      className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
                    >
                      <Hourglass className="w-3.5 h-3.5" />
                      <span>Join Priority Waitlist</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold">
                      ✓ Added to waitlist! We will notify you if a slot opens.
                    </span>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setCurrentStep(7);
                      }}
                      className={`py-3 px-4 rounded-2xl text-xs font-bold transition border ${
                        selectedSlot === slot
                          ? "bg-sky-600 text-white border-sky-600 shadow-md"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Reason for Visit */}
          {currentStep === 7 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 7 • Reason
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Reason for your visit
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Briefly describe symptoms or questions so your clinician can prepare.
              </p>

              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="E.g., Following up on skin redness on left arm, experiencing mild itching for 4 days..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Next: Patient Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Confirm Patient Information */}
          {currentStep === 8 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 8 • Patient Information
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Confirm your contact details
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Used to issue your reference token, digital check-in alerts, and visit summary.
              </p>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Maria Santos"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="patient@velahealth.com"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                    Mobile Phone (For Check-In SMS & Verification)
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (415) 555-0142"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(7)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(9)}
                  className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Next: Review Booking →
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Review & Confirm */}
          {currentStep === 9 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Step 9 • Review
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Review appointment details
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Please verify all items before finalizing your appointment reservation.
              </p>

              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 mb-6 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Clinician:</span>
                  <span className="font-bold text-slate-900">
                    Dr. {selectedDoctor?.user?.firstName} {selectedDoctor?.user?.lastName}, MD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Facility:</span>
                  <span className="font-semibold text-slate-800">{selectedClinic?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-semibold text-sky-700">
                    {consultationType === "IN_PERSON" ? "In-Person Clinic Visit" : "Encrypted Telehealth Video"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="font-bold text-slate-900">
                    {selectedDate} at {selectedSlot || "10:30"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Consultation Fee:</span>
                  <span className="font-extrabold text-slate-900">${selectedDoctor?.consultationFee}</span>
                </div>
                {reason && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1">Patient Reason:</span>
                    <p className="text-slate-800 italic">{reason}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(8)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 10: Confirmed (Success Celebration Screen) */}
          {currentStep === 10 && confirmationData && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Booking Confirmed
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                You are on the schedule!
              </h2>

              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                Reference Number: <strong className="text-slate-900">{confirmationData.referenceNo}</strong>
              </p>

              {/* Status Timeline */}
              <div className="my-8 max-w-md mx-auto bg-slate-50 p-5 rounded-3xl border border-slate-200/80 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Live Appointment Status
                </span>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Confirmed</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div className="text-slate-500">Upcoming</div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div className="text-slate-400">Digital Check-In</div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div className="text-slate-400">Completed</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/patient"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition"
                >
                  View in Patient App
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BookingFlowPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#EDF3F8] flex items-center justify-center text-xs text-slate-400">
          Loading booking flow...
        </div>
      }
    >
      <BookingFlowContent />
    </React.Suspense>
  );
}
