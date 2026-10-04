"use client";
import { useEffect, useState } from "react";
import { EmptyState, PageHeading } from "./CareUI";
import { clinicDate, visitLabel } from "@/lib/care-time";
import type { Appointment, AppointmentStatus } from "@/types";
const actions: Partial<Record<AppointmentStatus, AppointmentStatus[]>> = {
  REQUESTED: ["CONFIRMED", "CANCELLED"],
  RESCHEDULED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "IN_CONSULTATION", "NO_SHOW", "CANCELLED"],
  UPCOMING: ["CHECKED_IN", "IN_CONSULTATION", "NO_SHOW", "CANCELLED"],
  CHECKED_IN: ["IN_CONSULTATION", "NO_SHOW", "CANCELLED"],
};
export default function AppointmentOperations({
  today = false,
}: {
  today?: boolean;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(today ? clinicDate() : "");
  const [status, setStatus] = useState("");
  const [clinic, setClinic] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [confirm, setConfirm] = useState<{
    id: string;
    status: AppointmentStatus;
  } | null>(null);
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/appointments");
      if (!r.ok) throw Error("Unable to load appointments.");
      const d = await r.json();
      setAppointments(d.appointments || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  async function update() {
    if (!confirm) return;
    setBusy(confirm.id);
    setError("");
    try {
      const r = await fetch(`/api/appointments/${confirm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: confirm.status,
          note: "Updated by clinic operations",
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "Unable to update appointment.");
      setAppointments((previous) =>
        previous.map((a) =>
          a.id === confirm.id ? { ...a, status: confirm.status } : a,
        ),
      );
      setConfirm(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy("");
    }
  }
  const filtered = appointments
    .filter(
      (a) =>
        (!date || a.scheduledDate === date) &&
        (!status || a.status === status) &&
        (!clinic || a.clinicId === clinic) &&
        [a.patientName, a.doctorName, a.referenceNo, a.clinicName].some((v) =>
          v?.toLowerCase().includes(search.toLowerCase()),
        ),
    )
    .sort((a, b) =>
      (a.scheduledDate + a.scheduledTime).localeCompare(
        b.scheduledDate + b.scheduledTime,
      ),
    );
  return (
    <>
      <PageHeading
        eyebrow="Network operations"
        title={
          today
            ? "The clinic day, in focus."
            : "Appointments across the network."
        }
        description="Recorded appointments and care stages. Refresh to see the latest changes. Completed clinical records are published by the treating physician."
      />
      <div className="flex flex-wrap gap-4 items-end mb-8">
        <label className="field flex-1 min-w-[180px]">
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Patient, physician or reference"
          />
        </label>
        <label className="field">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="field">
          Clinic
          <select value={clinic} onChange={(e) => setClinic(e.target.value)}>
            <option value="">All clinics</option>
            {Array.from(
              new Map(
                appointments.map((a) => [a.clinicId, a.clinicName]),
              ).entries(),
            ).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {Array.from(new Set(appointments.map((a) => a.status)))
              .sort()
              .map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
          </select>
        </label>
        <button
          className="btn btn-secondary"
          disabled={loading}
          onClick={refresh}
        >
          Refresh
        </button>
      </div>
      {error && (
        <p role="alert" className="error-state mb-5">
          {error}
        </p>
      )}
      {confirm && (
        <section className="panel p-6 mb-6" aria-label="Confirm status change">
          <p>
            Change this appointment to{" "}
            <strong>{confirm.status.replaceAll("_", " ").toLowerCase()}</strong>
            ?
          </p>
          <div className="flex gap-3 mt-4">
            <button
              className="btn btn-primary"
              disabled={!!busy}
              onClick={update}
            >
              {busy ? "Saving…" : "Confirm change"}
            </button>
            <button
              className="btn btn-secondary"
              disabled={!!busy}
              onClick={() => setConfirm(null)}
            >
              Keep current status
            </button>
          </div>
        </section>
      )}
      {loading ? (
        <p role="status">Loading appointments…</p>
      ) : !filtered.length ? (
        <EmptyState
          title="No matching appointments"
          description="Choose a different date or adjust your filters."
        />
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Visit / reference</th>
                <th>Patient / physician</th>
                <th>Clinic</th>
                <th>Status</th>
                <th>Update stage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>
                      {visitLabel(a.scheduledDate, a.scheduledTime)}
                    </strong>
                    <p className="text-sm text-vela-muted mt-2">
                      {a.referenceNo}
                    </p>
                  </td>
                  <td>
                    <strong>{a.patientName}</strong>
                    <p className="mt-2">{a.doctorName}</p>
                  </td>
                  <td>
                    {a.clinicName}
                    <p className="text-sm text-vela-muted mt-2">
                      {a.consultationType === "TELEHEALTH"
                        ? "Virtual"
                        : "In person"}
                    </p>
                  </td>
                  <td>
                    <span className="status">
                      {a.status.replaceAll("_", " ").toLowerCase()}
                    </span>
                  </td>
                  <td>
                    {actions[a.status]?.length ? (
                      <select
                        aria-label={`Update ${a.referenceNo}`}
                        value=""
                        disabled={!!busy}
                        onChange={(e) =>
                          setConfirm({
                            id: a.id,
                            status: e.target.value as AppointmentStatus,
                          })
                        }
                      >
                        <option value="">Choose action</option>
                        {actions[a.status]?.map((s) => (
                          <option key={s} value={s}>
                            {s.replaceAll("_", " ").toLowerCase()}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-vela-muted">
                        {a.status === "IN_CONSULTATION"
                          ? "With physician"
                          : "No available changes"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
