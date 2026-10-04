"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Appointment } from "@/types";
import { PageHeading, EmptyState } from "@/components/CareUI";
import { visitLabel } from "@/lib/care-time";
export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followup, setFollowup] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`/api/appointments/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setAppointment(d.appointment);
        setNotes(d.appointment.clinicalNotes || "");
        setPrescription(d.appointment.prescription || "");
        setFollowup(d.appointment.followUpInstructions || "");
        const p = await fetch("/api/doctor/patients").then((r) => r.json());
        setPatient(
          p.patients?.find((x: any) => x.id === d.appointment.patientId),
        );
      })
      .catch(() =>
        setError(
          "Encounter could not be loaded. It may not be assigned to you.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);
  async function save(completed: boolean) {
    if (!appointment || !notes.trim()) {
      setError("Enter your clinical assessment before saving.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const r = await fetch(
        `/api/appointments/${appointment.id}/clinical-workspace`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clinicalNotes: notes,
            prescription,
            followUpInstructions: followup,
            markCompleted: completed,
          }),
        },
      );
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setAppointment({
        ...appointment,
        status: completed ? "COMPLETED" : "IN_CONSULTATION",
      });
      setMessage(
        completed
          ? "Visit completed. The summary is now available in the patient’s document center."
          : "Draft saved. This encounter is in consultation.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save encounter.");
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <p role="status">Loading clinical workspace…</p>;
  if (!appointment)
    return (
      <EmptyState
        title="Encounter unavailable"
        description={error}
        href="/doctor/appointments"
        label="Back to appointments"
      />
    );
  const readonly = ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(
    appointment.status,
  );
  return (
    <>
      <PageHeading
        eyebrow="CLINICAL ENCOUNTER"
        title={appointment.patientName || "Patient encounter"}
        description={`${visitLabel(appointment.scheduledDate, appointment.scheduledTime)} · ${appointment.clinicName} · ${appointment.referenceNo}`}
      />
      <div className="flex justify-between gap-5 items-center mb-6">
        <span className="status">
          {appointment.status.replaceAll("_", " ")}
        </span>
        <Link className="text-link" href="/doctor/appointments">
          Back to appointments
        </Link>
      </div>
      {error && (
        <p role="alert" className="notice notice-error mb-6">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="notice mb-6">
          {message}
        </p>
      )}
      <div className="clinical-workspace">
        <aside className="stack">
          <div className="panel">
            <h2 className="text-xl">Patient context</h2>
            <dl className="context-list">
              <dt>Date of birth</dt>
              <dd>{patient?.date_of_birth || "Not recorded"}</dd>
              <dt>Blood type</dt>
              <dd>{patient?.blood_type || "Not recorded"}</dd>
              <dt>Emergency contact</dt>
              <dd>
                {patient?.emergency_contact_name || "Not recorded"}
                <br />
                {patient?.emergency_contact_phone}
              </dd>
              <dt>Allergies</dt>
              <dd>Not recorded in this system. Confirm with the patient.</dd>
            </dl>
          </div>
          <div className="panel">
            <h2 className="text-xl">Visit purpose</h2>
            <p className="mt-4 leading-relaxed">{appointment.reason}</p>
            <p className="mt-6 text-sm text-vela-muted">
              {appointment.consultationType === "TELEHEALTH"
                ? "Virtual consultation"
                : "In-person consultation"}
            </p>
            <p className="mt-2 text-sm text-vela-muted">
              {appointment.checkedInAt
                ? `Checked in: ${new Date(appointment.checkedInAt).toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles" })} PT`
                : "No check-in recorded"}
            </p>
          </div>
        </aside>
        <section className="panel">
          <h2 className="text-2xl mb-8">Consultation record</h2>
          {readonly && (
            <p className="notice mb-6">
              This encounter is {appointment.status.toLowerCase()}. The record
              is read-only.
            </p>
          )}
          <label htmlFor="notes" className="field-label">
            Clinical assessment and plan
          </label>
          <textarea
            id="notes"
            className="field mb-6"
            rows={10}
            readOnly={readonly}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record the history, examination, assessment, and plan."
          />
          <label htmlFor="prescription" className="field-label">
            Medication instructions
          </label>
          <textarea
            id="prescription"
            className="field mb-6"
            rows={4}
            readOnly={readonly}
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Medication, dose, route, frequency, and duration if applicable."
          />
          <p className="text-xs text-vela-muted mb-6">
            Instructions are shared with the patient. This platform does not
            transmit prescriptions to a pharmacy.
          </p>
          <label htmlFor="followup" className="field-label">
            Follow-up instructions
          </label>
          <textarea
            id="followup"
            className="field"
            rows={4}
            readOnly={readonly}
            value={followup}
            onChange={(e) => setFollowup(e.target.value)}
          />
          {!readonly && (
            <div className="flex gap-4 flex-wrap mt-8">
              <button
                disabled={busy}
                className="btn btn-secondary"
                onClick={() => save(false)}
              >
                Save draft
              </button>
              <button
                disabled={busy}
                className="btn btn-primary"
                onClick={() => save(true)}
              >
                {busy ? "Saving…" : "Complete visit & publish summary"}
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
