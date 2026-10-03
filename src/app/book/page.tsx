"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import { PageHeading } from "@/components/CareUI";
import { clinicDate } from "@/lib/care-time";
import type { Clinic, DoctorProfile, ConsultationType, User } from "@/types";
function Booking() {
  const params = useSearchParams();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(1);
  const [doctorId, setDoctorId] = useState(params.get("doctorId") || "");
  const [type, setType] = useState<ConsultationType>(
    params.get("type") === "TELEHEALTH" ? "TELEHEALTH" : "IN_PERSON",
  );
  const [date, setDate] = useState(clinicDate());
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    appointmentId: string;
    referenceNo: string;
  } | null>(null);
  const [waitlisted, setWaitlisted] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all(
      ["/api/doctors", "/api/clinics", "/api/auth/me"].map(async (url) => {
        const r = await fetch(url);
        if (!r.ok) throw Error("Unable to load booking information.");
        return r.json();
      }),
    )
      .then(([d, c, a]) => {
        if (!alive) return;
        setDoctors(d.doctors);
        setClinics(c.clinics);
        setUser(a.user);
        const draft = sessionStorage.getItem("vela-booking-draft");
        if (draft) {
          try {
            const saved = JSON.parse(draft);
            setDoctorId(saved.doctorId || "");
            setType(saved.type === "TELEHEALTH" ? "TELEHEALTH" : "IN_PERSON");
            setDate(saved.date >= clinicDate() ? saved.date : clinicDate());
            setReason(saved.reason || "");
          } catch {
            sessionStorage.removeItem("vela-booking-draft");
          }
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    setTime("");
    setSlots([]);
    setWaitlisted(false);
    if (!doctorId) return;
    const controller = new AbortController();
    setSlotLoading(true);
    fetch(
      `/api/availability?${new URLSearchParams({ doctorId, date, type })}`,
      { signal: controller.signal },
    )
      .then(async (r) => {
        if (!r.ok) throw Error("Unable to load available times.");
        return r.json();
      })
      .then((d) => setSlots(d.slots || []))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSlotLoading(false);
      });
    return () => controller.abort();
  }, [doctorId, date, type]);
  const doctor = doctors.find((d) => d.userId === doctorId);
  const clinic = clinics.find((c) => c.id === doctor?.clinicId);
  const filtered = doctors.filter(
    (d) =>
      (!params.get("clinicId") || d.clinicId === params.get("clinicId")) &&
      (!params.get("specialty") ||
        d.specialtyId === params.get("specialty") ||
        d.specialtyName?.toLowerCase().replaceAll(" ", "-") ===
          params.get("specialty")) &&
      (type === "TELEHEALTH" ? d.telehealthAvailable : d.inPersonAvailable),
  );
  async function submit(waitlist = false) {
    setBusy(true);
    setError("");
    try {
      const payload = waitlist
        ? {
            doctorId,
            preferredStartDate: date,
            preferredEndDate: date,
            preferredTimeRange: "Any available time",
            notes: reason,
          }
        : {
            doctorId,
            clinicId: doctor?.clinicId,
            consultationType: type,
            scheduledDate: date,
            scheduledTime: time,
            reason,
            rescheduleId: params.get("reschedule"),
          };
      const r = await fetch(waitlist ? "/api/waitlist" : "/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await r.json();
      if (!r.ok || !result.success)
        throw Error(result.error || "Unable to save your request.");
      if (waitlist) setWaitlisted(true);
      else {
        setConfirmation(result);
        sessionStorage.removeItem("vela-booking-draft");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  function saveDraft() {
    sessionStorage.setItem(
      "vela-booking-draft",
      JSON.stringify({ doctorId, type, date, reason }),
    );
  }
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <PageHeading
          eyebrow="Appointments"
          title={
            params.get("reschedule")
              ? "Choose a new appointment"
              : "Let’s find time for your care."
          }
          description="Choose your physician, an available time, and review your visit. All appointment times are Pacific Time."
        />
        {error && (
          <p role="alert" className="error-state mb-6">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status">Loading appointment options…</p>
        ) : confirmation ? (
          <section className="panel p-8">
            <p className="eyebrow">Appointment confirmed</p>
            <h2 className="text-3xl mt-3">Your visit is booked.</h2>
            <p className="my-5">
              {date} at {time} PT · Dr. {doctor?.user?.lastName}
              <br />
              Reference: {confirmation.referenceNo}
            </p>
            <Link
              className="btn btn-primary"
              href={`/patient/appointments/${confirmation.appointmentId}`}
            >
              View appointment & preparation
            </Link>
          </section>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            <section>
              <ol
                className="flex gap-6 border-b border-vela-border pb-5 mb-8"
                aria-label="Booking steps"
              >
                {["Physician", "Date & time", "Review"].map((label, i) => (
                  <li
                    key={label}
                    aria-current={step === i + 1 ? "step" : undefined}
                    className={
                      step === i + 1 ? "font-semibold" : "text-vela-muted"
                    }
                  >
                    {i + 1}. {label}
                  </li>
                ))}
              </ol>
              {step === 1 ? (
                <>
                  <fieldset className="mb-8">
                    <legend className="font-semibold mb-3">
                      How would you like to meet?
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      {(["IN_PERSON", "TELEHEALTH"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`btn ${t === type ? "btn-primary" : "btn-secondary"}`}
                          aria-pressed={t === type}
                          onClick={() => {
                            setType(t);
                            setDoctorId("");
                          }}
                        >
                          {t === "IN_PERSON" ? "In person" : "Virtual visit"}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label className="field">
                    Select your physician
                    <select
                      value={doctorId}
                      required
                      onChange={(e) => setDoctorId(e.target.value)}
                    >
                      <option value="">Choose a physician</option>
                      {filtered.map((d) => (
                        <option key={d.userId} value={d.userId}>
                          Dr. {d.user?.firstName} {d.user?.lastName} —{" "}
                          {d.specialtyName}
                        </option>
                      ))}
                    </select>
                  </label>
                  {!filtered.length && (
                    <p className="mt-4">
                      No physicians match this selection.{" "}
                      <Link className="text-link" href="/doctors">
                        Browse all physicians
                      </Link>
                    </p>
                  )}
                  <button
                    className="btn btn-primary mt-8"
                    disabled={!doctor?.clinicId}
                    onClick={() => setStep(2)}
                  >
                    Choose date & time
                  </button>
                </>
              ) : step === 2 ? (
                <>
                  <label className="field max-w-sm">
                    Appointment date
                    <input
                      type="date"
                      value={date}
                      min={clinicDate()}
                      required
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                  <fieldset className="mt-7">
                    <legend className="font-semibold mb-4">
                      Available times · Pacific Time
                    </legend>
                    {slotLoading ? (
                      <p role="status">Checking availability…</p>
                    ) : slots.length ? (
                      <div className="flex flex-wrap gap-3">
                        {slots.map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`btn ${t === time ? "btn-primary" : "btn-secondary"}`}
                            aria-pressed={t === time}
                            onClick={() => setTime(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No open times on this date. Try another day.</p>
                        {user?.role === "PATIENT" && (
                          <button
                            disabled={busy || waitlisted}
                            className="btn btn-secondary mt-4"
                            onClick={() => submit(true)}
                          >
                            {waitlisted
                              ? "Added to waitlist"
                              : "Join waitlist for this day"}
                          </button>
                        )}
                        {waitlisted && (
                          <p role="status" className="mt-3">
                            Your request is recorded. The clinic must contact
                            you if an opening becomes available.
                          </p>
                        )}
                      </div>
                    )}
                  </fieldset>
                  <div className="flex gap-3 mt-8">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-primary"
                      disabled={!time || slotLoading}
                      onClick={() => setStep(3)}
                    >
                      Review appointment
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label className="field">
                    What would you like to discuss?
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      maxLength={2000}
                      rows={4}
                      required
                      placeholder="Briefly describe the reason for your visit."
                    />
                  </label>
                  <p className="text-vela-muted mt-3">
                    Please keep detailed medical information for your
                    consultation. This service is not for emergencies.
                  </p>
                  {user?.role === "PATIENT" ? (
                    <button
                      className="btn btn-primary mt-8"
                      disabled={busy || !reason.trim()}
                      onClick={() => submit()}
                    >
                      {busy
                        ? "Confirming…"
                        : params.get("reschedule")
                          ? "Confirm new appointment"
                          : "Confirm appointment"}
                    </button>
                  ) : (
                    <div className="mt-8">
                      <p className="mb-4">
                        Sign in with a patient account to confirm this visit.
                      </p>
                      <Link
                        onClick={saveDraft}
                        className="btn btn-primary"
                        href={`/login?returnTo=${encodeURIComponent("/book" + (params.toString() ? "?" + params.toString() : ""))}`}
                      >
                        Patient sign in
                      </Link>
                    </div>
                  )}
                  <button
                    className="btn btn-secondary mt-8 ml-3"
                    disabled={busy}
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                </>
              )}
            </section>
            <aside className="panel p-7 h-fit">
              <p className="eyebrow">Your visit</p>
              <h2 className="text-xl mt-4">
                {doctor
                  ? `Dr. ${doctor.user?.firstName} ${doctor.user?.lastName}`
                  : "Choose your physician"}
              </h2>
              <p className="text-vela-muted mt-2">{doctor?.specialtyName}</p>
              <dl className="space-y-5 mt-6">
                <div>
                  <dt className="text-vela-muted">Location</dt>
                  <dd>
                    {type === "TELEHEALTH"
                      ? "Virtual visit"
                      : clinic?.name || "Selected with your physician"}
                  </dd>
                </div>
                <div>
                  <dt className="text-vela-muted">Date & time</dt>
                  <dd>
                    {date}
                    {time ? ` · ${time} PT` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-vela-muted">Consultation fee</dt>
                  <dd>
                    {doctor
                      ? `$${doctor.consultationFee}`
                      : "Shown after selecting a physician"}
                  </dd>
                </div>
              </dl>
              <p className="text-sm text-vela-muted border-t border-vela-border mt-6 pt-5">
                Ask your clinic about insurance and payment before your visit.{" "}
                {type === "TELEHEALTH"
                  ? "The clinic provides connection instructions; VELA does not currently host video calls."
                  : ""}
              </p>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<p className="page-shell py-12">Loading booking…</p>}>
      <Booking />
    </Suspense>
  );
}
