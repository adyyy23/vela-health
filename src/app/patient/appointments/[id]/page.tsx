"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeading, EmptyState } from "@/components/CareUI";
import { visitLabel, clinicDate } from "@/lib/care-time";
import type { Appointment } from "@/types";
export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [notice, setNotice] = useState("");
  const [doctorRating, setDoctorRating] = useState("5");
  const [clinicRating, setClinicRating] = useState("5");
  const [comment, setComment] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    fetch(`/api/appointments/${encodeURIComponent(id)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Unable to load appointment.");
        if (alive) {
          setAppointment(d.appointment);
          setReviewed(Boolean(d.appointment.hasReview));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => {
        if (alive) setLoading(false);
      });
    try {
      setChecked(
        JSON.parse(localStorage.getItem(`vela-preparation-${id}`) || "[]"),
      );
    } catch {}
    return () => {
      alive = false;
    };
  }, [id]);
  async function action(kind: "cancel" | "check-in" | "review") {
    if (!appointment) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const url = `/api/appointments/${appointment.id}${kind === "cancel" ? "" : `/${kind}`}`;
      const payload =
        kind === "cancel"
          ? { status: "CANCELLED", note: "Cancelled by patient" }
          : kind === "review"
            ? {
                doctorRating: Number(doctorRating),
                clinicRating: Number(clinicRating),
                comment,
              }
            : undefined;
      const r = await fetch(url, {
        method: kind === "cancel" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "Unable to complete this action.");
      if (kind === "review") {
        setReviewed(true);
        setNotice("Thank you. Your review has been recorded.");
      } else {
        setAppointment({
          ...appointment,
          status: kind === "cancel" ? "CANCELLED" : "CHECKED_IN",
        });
        setCancel(false);
        setNotice(d.message || "Appointment cancelled.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const editable =
    appointment &&
    ["REQUESTED", "CONFIRMED", "UPCOMING", "RESCHEDULED"].includes(
      appointment.status,
    );
  return (
    <>
      <Link className="text-link" href="/patient/appointments">
        ← All appointments
      </Link>
      <PageHeading
        eyebrow="Your visit"
        title={appointment?.doctorName || "Appointment details"}
        description={
          appointment
            ? visitLabel(appointment.scheduledDate, appointment.scheduledTime)
            : "Your appointment and next steps."
        }
      />
      {error && (
        <p role="alert" className="error-state mb-5">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="panel p-5 mb-5">
          {notice}
        </p>
      )}
      {loading ? (
        <p role="status">Loading your visit…</p>
      ) : !appointment ? (
        <EmptyState
          title="Visit unavailable"
          description="This appointment could not be found in your account."
        />
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <section>
            <span className="status">
              {appointment.status.replaceAll("_", " ").toLowerCase()}
            </span>
            <dl className="grid sm:grid-cols-2 gap-6 my-8">
              <div>
                <dt className="text-vela-muted">Reference</dt>
                <dd className="mt-2">{appointment.referenceNo}</dd>
              </div>
              <div>
                <dt className="text-vela-muted">Clinic</dt>
                <dd className="mt-2">{appointment.clinicName}</dd>
              </div>
              <div>
                <dt className="text-vela-muted">Visit format</dt>
                <dd className="mt-2">
                  {appointment.consultationType === "TELEHEALTH"
                    ? "Virtual consultation"
                    : "In-person consultation"}
                </dd>
              </div>
              <div>
                <dt className="text-vela-muted">Reason for visit</dt>
                <dd className="mt-2">{appointment.reason}</dd>
              </div>
            </dl>
            {appointment.consultationType === "TELEHEALTH" && (
              <p className="panel p-5 mb-7">
                Your clinic provides connection instructions. This portal does
                not host video calls.{" "}
                <Link href="/patient/messages" className="text-link">
                  Contact your care team
                </Link>{" "}
                if you have not received them.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-secondary" href="/patient/messages">
                Message care team
              </Link>
              {editable && (
                <>
                  <Link
                    className="btn btn-primary"
                    href={`/book?doctorId=${appointment.doctorId}&type=${appointment.consultationType}&reschedule=${appointment.id}`}
                  >
                    Reschedule
                  </Link>
                  <button
                    className="btn btn-secondary"
                    disabled={busy}
                    onClick={() => setCancel(true)}
                  >
                    Cancel appointment
                  </button>
                </>
              )}
              {["CONFIRMED", "UPCOMING"].includes(appointment.status) &&
                appointment.scheduledDate === clinicDate() &&
                appointment.consultationType === "IN_PERSON" && (
                  <button
                    className="btn btn-primary"
                    disabled={busy}
                    onClick={() => action("check-in")}
                  >
                    Check in
                  </button>
                )}
            </div>
            {cancel && (
              <section
                className="panel p-6 mt-6"
                aria-label="Confirm cancellation"
              >
                <h2 className="font-semibold">Cancel this appointment?</h2>
                <p className="text-vela-muted mt-2">
                  Your reserved time will become available to other patients.
                </p>
                <div className="flex gap-3 mt-5">
                  <button
                    className="btn btn-primary"
                    disabled={busy}
                    onClick={() => action("cancel")}
                  >
                    {busy ? "Cancelling…" : "Confirm cancellation"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    disabled={busy}
                    onClick={() => setCancel(false)}
                  >
                    Keep appointment
                  </button>
                </div>
              </section>
            )}
            {appointment.status === "COMPLETED" && (
              <section className="border-t border-vela-border mt-10 pt-7">
                <h2 className="text-xl font-semibold">After your visit</h2>
                <Link
                  className="text-link inline-block my-5"
                  href="/patient/documents"
                >
                  Review published visit documents →
                </Link>
                {!reviewed && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      action("review");
                    }}
                  >
                    <h3 className="font-semibold mb-4">
                      Share your experience
                    </h3>
                    <div className="flex gap-6 flex-wrap">
                      <label className="field">
                        Physician rating
                        <select
                          value={doctorRating}
                          onChange={(e) => setDoctorRating(e.target.value)}
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} / 5
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        Clinic rating
                        <select
                          value={clinicRating}
                          onChange={(e) => setClinicRating(e.target.value)}
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} / 5
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="field mt-5">
                      Comments (optional)
                      <textarea
                        maxLength={2000}
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                    <button className="btn btn-primary mt-5" disabled={busy}>
                      Submit review
                    </button>
                  </form>
                )}
              </section>
            )}
          </section>
          <aside className="panel p-7 h-fit">
            <h2 className="text-xl font-semibold">Prepare for your visit</h2>
            <p className="text-vela-muted text-sm mt-2">
              A personal checklist, saved on this device.
            </p>
            <fieldset className="space-y-5 mt-6">
              <legend className="sr-only">Visit preparation</legend>
              {[
                "Have identification and insurance details ready",
                "Prepare your medication list",
                "Gather relevant records",
                "Write down your questions",
              ].map((label) => (
                <label className="flex gap-3" key={label}>
                  <input
                    type="checkbox"
                    checked={checked.includes(label)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...checked, label]
                        : checked.filter((v) => v !== label);
                      setChecked(next);
                      localStorage.setItem(
                        `vela-preparation-${id}`,
                        JSON.stringify(next),
                      );
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <p className="text-sm text-vela-muted border-t border-vela-border pt-5 mt-6">
              In-person check-in opens 20 minutes before your appointment. For
              emergencies, contact your local emergency services.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
