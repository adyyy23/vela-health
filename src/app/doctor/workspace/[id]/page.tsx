"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Appointment } from "@/types";
import {
  FileEdit,
  User,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  Send,
  MessageSquare,
  AlertCircle,
  FileText,
  ChevronLeft,
  ShieldCheck,
  Stethoscope,
  Pill,
} from "lucide-react";

export default function ClinicalWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.appointments) {
          const found = data.appointments.find((a: Appointment) => a.id === id || a.referenceNo === id);
          if (found) {
            setAppointment(found);
            setClinicalNotes(found.clinicalNotes || "");
            setPrescription(found.prescription || "");
            setFollowUpInstructions(found.followUpInstructions || "");
          }
        }
        setLoading(false);
      });
  }, [id]);

  const handleSaveWorkspace = async (markCompleted: boolean) => {
    if (!appointment) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/appointments/${appointment.id}/clinical-workspace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicalNotes: clinicalNotes || "Patient examined. Routine clinical management completed.",
          prescription,
          followUpInstructions,
          markCompleted,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (markCompleted) {
          setAppointment({ ...appointment, status: "COMPLETED" });
          setTimeout(() => {
            router.push("/doctor");
          }, 1400);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Clinical Workspace...</div>;
  }

  if (!appointment) {
    return (
      <div className="p-8 text-center">
        <p className="text-xs text-slate-500 mb-4">Encounter record not found.</p>
        <Link href="/doctor" className="px-4 py-2 bg-vela-sage hover:bg-vela-sageDark text-white rounded-xl text-xs font-bold transition">
          Back to Today
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      {/* Top Header / Status Bar */}
      <div className="bg-white rounded-card p-4 sm:px-6 border border-[#E2E8E4] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/doctor"
            className="p-2 rounded-button bg-vela-surfaceSubtle hover:bg-[#EAF0EC] text-vela-ink transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-vela-sage">
                Active Clinical Workspace
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-pill ${
                  appointment.status === "COMPLETED"
                    ? "bg-vela-surfaceSubtle text-vela-muted border border-[#E2E8E4]"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {appointment.status.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-vela-ink tracking-tight">
              Encounter: {appointment.patientName} (Ref #{appointment.referenceNo})
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href={`/doctor/messages`}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-button bg-vela-surfaceSubtle hover:bg-[#EAF0EC] text-vela-ink text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <MessageSquare className="w-4 h-4 text-vela-sage" />
            <span>Message Patient</span>
          </Link>

          <button
            onClick={() => handleSaveWorkspace(false)}
            disabled={saving}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-button bg-white border border-[#E2E8E4] hover:bg-vela-surfaceSubtle text-vela-ink text-xs font-bold transition shadow-sm"
          >
            {saving ? "Saving..." : "Save Draft Notes"}
          </button>

          <button
            onClick={() => handleSaveWorkspace(true)}
            disabled={saving || appointment.status === "COMPLETED"}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finalize & Complete</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Clinical encounter saved successfully and visit summary published to patient stream!</span>
        </div>
      )}

      {/* 3-COLUMN CLINICAL WORKSPACE ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PATIENT CONTEXT (Col 3) */}
        <div className="lg:col-span-3 bg-white rounded-card p-5 border border-[#E2E8E4] shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8E4]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt={appointment.patientName}
              className="w-12 h-12 rounded-xl object-cover border border-[#E2E8E4] shrink-0"
            />
            <div>
              <h3 className="font-bold text-sm text-vela-ink leading-tight">
                {appointment.patientName}
              </h3>
              <span className="text-[11px] text-vela-muted">Female • 29 yrs old</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-vela-muted font-bold uppercase block">Blood Type</span>
              <span className="font-bold text-vela-ink">O Positive (O+)</span>
            </div>

            <div>
              <span className="text-[10px] text-vela-muted font-bold uppercase block">Emergency Contact</span>
              <span className="text-vela-ink font-medium">Carlos Santos (Spouse)</span>
              <span className="text-vela-muted block text-[11px]">+1 (415) 555-0199</span>
            </div>

            <div>
              <span className="text-[10px] text-vela-muted font-bold uppercase block">Known Allergies</span>
              <span className="text-vela-ink font-medium">No Known Drug Allergies (NKDA)</span>
            </div>

            <div className="pt-2 border-t border-[#E2E8E4]">
              <span className="text-[10px] text-vela-muted font-bold uppercase block mb-2">Previous Encounters</span>
              <div className="p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-[11px]">
                <span className="font-bold text-vela-ink block">Initial Skin Screening</span>
                <span className="text-vela-muted">Last Week • Dr. Elena Reyes</span>
                <p className="text-vela-muted mt-1 line-clamp-2">
                  Localized eczematous patch on left forearm. Prescribed Desonide 0.05% ointment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: APPOINTMENT DETAILS & REASON (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-card p-5 sm:p-6 border border-[#E2E8E4] shadow-sm flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-vela-sage block mb-1">
              Visit Purpose & Intake
            </span>
            <h3 className="font-extrabold text-vela-ink text-base tracking-tight">
              Patient Reason for Consultation
            </h3>
          </div>

          <div className="p-4 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs">
            <span className="text-[10px] font-bold text-vela-muted uppercase block mb-1">Chief Complaint</span>
            <p className="text-vela-ink font-semibold leading-relaxed">
              &ldquo;{appointment.reason}&rdquo;
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-vela-muted font-bold uppercase block">Arrival Status</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Checked In digitally at 10:15 AM</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] text-vela-muted font-bold uppercase block">Consultation Format</span>
              <span className="text-vela-ink font-semibold">
                {appointment.consultationType === "IN_PERSON" ? "In-Person Clinic Visit (Suite 800)" : "Telehealth HD Video"}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-vela-muted font-bold uppercase block">Assigned Examination Room</span>
              <span className="text-vela-ink font-semibold">Exam Room 3B (Dermatoscopy Station)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLINICAL NOTES, PRESCRIPTION, ACTIONS (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-card p-5 sm:p-6 border border-[#E2E8E4] shadow-sm flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-vela-sage block mb-1">
              Clinical Documentation
            </span>
            <h3 className="font-extrabold text-vela-ink text-base tracking-tight">
              Physician Consultation Notes
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Subjective / Objective / Assessment Notes */}
            <div>
              <label className="text-[10px] font-bold uppercase text-vela-muted block mb-1.5">
                Examination & Clinical Assessment
              </label>
              <textarea
                rows={5}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Enter clinical examination findings, skin assessment, or diagnostic observations..."
                className="w-full p-3.5 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-mono text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage leading-relaxed"
              />
            </div>

            {/* Electronic Prescription */}
            <div>
              <label className="text-[10px] font-bold uppercase text-vela-muted block mb-1.5 flex items-center gap-1">
                <Pill className="w-3.5 h-3.5 text-vela-sage" />
                <span>e-Prescription & Pharmacy Instructions</span>
              </label>
              <input
                type="text"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="E.g., Desonide 0.05% cream - Apply twice daily for 5 days as needed."
                className="w-full px-3.5 py-2.5 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>

            {/* Follow-up instructions */}
            <div>
              <label className="text-[10px] font-bold uppercase text-vela-muted block mb-1.5">
                Patient Follow-Up & Home Care
              </label>
              <textarea
                rows={3}
                value={followUpInstructions}
                onChange={(e) => setFollowUpInstructions(e.target.value)}
                placeholder="Instructions sent directly to patient Care Stream upon completion..."
                className="w-full p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
