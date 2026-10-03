"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Appointment } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  Building2,
  Navigation,
  MessageSquare,
  FileText,
  Star,
  ChevronLeft,
  AlertCircle,
  Share2,
} from "lucide-react";

export default function PatientAppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState("");

  // Review state
  const [doctorRating, setDoctorRating] = useState(5);
  const [clinicRating, setClinicRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Cancellation state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelAppointment = async () => {
    if (!appointment) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED", note: "Cancelled by patient" }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointment({ ...appointment, status: "CANCELLED" });
        setShowCancelConfirm(false);
      }
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.appointments) {
          const found = data.appointments.find((a: Appointment) => a.id === id || a.referenceNo === id);
          if (found) setAppointment(found);
        }
        setLoading(false);
      });
  }, [id]);

  const handleDigitalCheckIn = async () => {
    if (!appointment) return;
    setCheckingIn(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/check-in`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCheckInMsg(data.message || "You are checked in! Proceed to Reception Area B.");
        setAppointment({ ...appointment, status: "CHECKED_IN" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorRating, clinicRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setAppointment({ ...appointment, hasReview: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading appointment details...</div>;
  }

  if (!appointment) {
    return (
      <div className="p-8 text-center">
        <p className="text-xs text-slate-500 mb-4">Appointment not found.</p>
        <Link href="/patient/appointments" className="px-4 py-2 bg-vela-sage hover:bg-vela-sageDark text-white rounded-xl text-xs font-bold transition">
          Back to Appointments
        </Link>
      </div>
    );
  }

  const statusSteps = ["REQUESTED", "CONFIRMED", "CHECKED_IN", "COMPLETED"];
  const currentStepIndex = statusSteps.indexOf(appointment.status);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 text-vela-ink">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/patient/appointments"
          className="inline-flex items-center gap-1 text-xs font-semibold text-vela-muted hover:text-vela-ink transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Appointments</span>
        </Link>

        <span className="text-[10px] font-bold text-vela-muted uppercase tracking-wider">
          Ref: {appointment.referenceNo}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-pill border ${
              appointment.status === "CHECKED_IN"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : appointment.status === "COMPLETED"
                ? "bg-vela-surfaceSubtle text-vela-muted border-[#E2E8E4]"
                : "bg-[#EAF0EC] text-vela-forest border-vela-sage/30"
            }`}
          >
            {appointment.status.replace("_", " ")}
          </span>

          <span className="text-xs text-vela-muted">
            {appointment.consultationType === "TELEHEALTH" ? "Telehealth Video" : "In-Person Clinic Visit"}
          </span>
        </div>

        {/* Doctor Header */}
        <div className="flex items-start gap-4 mb-6">
          <img
            src={appointment.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
            alt={appointment.doctorName}
            className="w-16 h-16 rounded-xl object-cover border border-[#E2E8E4] shrink-0"
          />
          <div>
            <h2 className="text-lg font-bold text-vela-ink leading-tight">
              {appointment.doctorName}
            </h2>
            <p className="text-xs text-vela-sage font-semibold">{appointment.doctorSpecialty}</p>
            <p className="text-xs text-vela-muted mt-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-vela-muted" />
              <span>{appointment.clinicName}</span>
            </p>
          </div>
        </div>

        {/* Schedule box */}
        <div className="bg-vela-surfaceSubtle p-4 rounded-button border border-[#E2E8E4] grid grid-cols-2 gap-3 text-xs mb-6">
          <div>
            <span className="text-[10px] text-vela-muted font-bold uppercase block">Date & Time</span>
            <span className="font-bold text-vela-ink text-sm">
              {appointment.scheduledDate} at {appointment.scheduledTime}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-vela-muted font-bold uppercase block">Consultation Fee</span>
            <span className="font-bold text-vela-ink text-sm">${appointment.doctorConsultationFee || 160}</span>
          </div>
        </div>

        {/* LIVE APPOINTMENT STATUS TIMELINE */}
        <div className="mb-6 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-vela-muted block mb-3">
            Live Appointment Timeline
          </span>
          <div className="flex items-center justify-between relative text-[11px] font-semibold text-vela-ink">
            <div className="flex flex-col items-center">
              <span className="w-3 h-3 rounded-full bg-vela-forest ring-2 ring-[#EAF0EC]" />
              <span className="mt-1 text-[10px]">Requested</span>
            </div>
            <div className="h-0.5 flex-1 bg-vela-forest mx-1" />

            <div className="flex flex-col items-center">
              <span className="w-3 h-3 rounded-full bg-vela-forest ring-2 ring-[#EAF0EC]" />
              <span className="mt-1 text-[10px]">Confirmed</span>
            </div>
            <div className={`h-0.5 flex-1 mx-1 ${currentStepIndex >= 2 ? "bg-vela-forest" : "bg-[#E2E8E4]"}`} />

            <div className="flex flex-col items-center">
              <span
                className={`w-3 h-3 rounded-full ${
                  currentStepIndex >= 2 ? "bg-vela-forest ring-2 ring-[#EAF0EC]" : "bg-[#E2E8E4]"
                }`}
              />
              <span className="mt-1 text-[10px]">Checked In</span>
            </div>
            <div className={`h-0.5 flex-1 mx-1 ${currentStepIndex >= 3 ? "bg-vela-forest" : "bg-[#E2E8E4]"}`} />

            <div className="flex flex-col items-center">
              <span
                className={`w-3 h-3 rounded-full ${
                  currentStepIndex >= 3 ? "bg-vela-forest ring-2 ring-[#EAF0EC]" : "bg-[#E2E8E4]"
                }`}
              />
              <span className="mt-1 text-[10px]">Completed</span>
            </div>
          </div>
        </div>

        {/* DIGITAL CHECK-IN ACTION */}
        {appointment.status !== "CHECKED_IN" && appointment.status !== "COMPLETED" && appointment.consultationType === "IN_PERSON" && (
          <div className="bg-[#EAF0EC] border border-vela-sage/30 rounded-card p-5 mb-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-vela-forest mb-1">
              <span className="w-2 h-2 rounded-full bg-vela-sage animate-ping" />
              <span>Digital Check-In Available</span>
            </div>
            <p className="text-xs text-vela-muted mb-4">
              Your appointment starts soon. Tap below to notify reception.
            </p>
            <button
              onClick={handleDigitalCheckIn}
              disabled={checkingIn}
              className="w-full py-3 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{checkingIn ? "Checking In..." : "Digital Check-In"}</span>
            </button>
          </div>
        )}

        {/* CHECKED IN CONFIRMATION MESSAGE */}
        {appointment.status === "CHECKED_IN" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-card p-5 mb-6">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You are Checked In</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Please proceed to <strong>Reception Area B</strong> on the 8th floor. Dr. Reyes will call your name shortly.
            </p>
          </div>
        )}

        {/* TELEHEALTH JOIN LINK */}
        {appointment.consultationType === "TELEHEALTH" && (
          <div className="bg-[#EAF0EC] border border-vela-sage/30 rounded-card p-5 mb-6 text-center">
            <Video className="w-8 h-8 text-vela-sage mx-auto mb-2" />
            <h4 className="font-bold text-xs text-vela-forest mb-1">Encrypted Telehealth Session</h4>
            <p className="text-xs text-vela-muted mb-3">
              Room opens 10 minutes prior to scheduled start time.
            </p>
            <button
              onClick={() => alert("Telehealth session is active and verified for this appointment.")}
              className="w-full py-3 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition"
            >
              Launch Telehealth Consultation
            </button>
          </div>
        )}

        {/* REASON & CLINICAL SUMMARY */}
        <div className="space-y-4 pt-2 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Reason for Visit</span>
            <p className="text-slate-800 font-medium">{appointment.reason}</p>
          </div>

          {appointment.clinicalNotes && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Physician Visit Summary</span>
              <p className="text-slate-800 leading-relaxed">{appointment.clinicalNotes}</p>
            </div>
          )}

          {appointment.prescription && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Prescriptions Issued</span>
              <p className="text-slate-800 font-semibold">{appointment.prescription}</p>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 pt-4 border-t border-[#E2E8E4] flex flex-wrap items-center justify-between gap-2">
          {appointment.clinicAddress && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(appointment.clinicAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[120px] py-2.5 rounded-button bg-vela-surfaceSubtle hover:bg-[#EAF0EC] text-vela-ink text-xs font-semibold text-center flex items-center justify-center gap-1 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-vela-sage" />
              <span>Directions</span>
            </a>
          )}

          <Link
            href="/patient/messages"
            className="flex-1 min-w-[120px] py-2.5 rounded-button bg-vela-surfaceSubtle hover:bg-[#EAF0EC] text-vela-ink text-xs font-semibold text-center flex items-center justify-center gap-1 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-vela-sage" />
            <span>Message Doctor</span>
          </Link>

          {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && (
            <>
              <Link
                href={`/book?reschedule=${appointment.id}&doctorId=${appointment.doctorId}&clinicId=${appointment.clinicId || ""}`}
                className="flex-1 min-w-[120px] py-2.5 rounded-button border border-vela-border hover:bg-vela-surfaceSubtle text-vela-ink text-xs font-semibold text-center flex items-center justify-center gap-1 transition"
              >
                <Calendar className="w-3.5 h-3.5 text-vela-sage" />
                <span>Reschedule</span>
              </Link>

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="py-2.5 px-3 rounded-button border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* CANCELLATION CONFIRMATION MODAL */}
        {showCancelConfirm && (
          <div className="mt-4 p-4 rounded-card bg-rose-50 border border-rose-200 text-xs space-y-3">
            <div className="flex items-start gap-2 text-rose-900 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>Are you sure you want to cancel this appointment?</span>
            </div>
            <p className="text-rose-700 leading-relaxed">
              Your reserved slot with {appointment.doctorName} will be released immediately.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCancelAppointment}
                disabled={cancelling}
                className="px-3.5 py-1.5 rounded-button bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Appointment"}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-3.5 py-1.5 rounded-button bg-white border border-rose-200 text-rose-800 font-semibold text-xs hover:bg-rose-50 transition"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        )}

        {appointment.status === "CANCELLED" && (
          <div className="mt-4 p-4 rounded-card bg-amber-50 border border-amber-200 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>This appointment was cancelled</span>
            </div>
            <p className="text-amber-800 mb-2">
              If you still require medical attention, you can schedule a new consultation with our physician network.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book New Appointment</span>
            </Link>
          </div>
        )}
      </div>

      {/* REVIEW SECTION (If appointment is COMPLETED) */}
      {appointment.status === "COMPLETED" && (
        <div className="bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm">
          <h3 className="text-base font-bold text-vela-ink tracking-tight mb-1">
            Rate Your Consultation Experience
          </h3>
          <p className="text-xs text-vela-muted mb-4">
            Help improve care standards across the Vela physician network.
          </p>

          {appointment.hasReview || reviewSuccess ? (
            <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your verified review has been recorded.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="text-vela-ink font-semibold block mb-1">Doctor Experience Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setDoctorRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= doctorRating ? "fill-amber-500 text-amber-500" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-vela-ink font-semibold block mb-1">Facility & Staff Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setClinicRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= clinicRating ? "fill-amber-500 text-amber-500" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-vela-ink font-semibold block mb-1">Written Feedback (Optional)</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about physician thoroughness and comfort of the clinic space..."
                  className="w-full p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full py-3 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition"
              >
                {reviewSubmitting ? "Submitting Review..." : "Submit Verified Review"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
