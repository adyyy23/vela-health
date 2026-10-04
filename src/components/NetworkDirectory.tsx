"use client";
import { useState } from "react";
import type { DoctorProfile, Clinic } from "@/types";
export default function NetworkDirectory({
  doctors,
  clinics,
}: {
  doctors?: DoctorProfile[];
  clinics?: Clinic[];
}) {
  const [staff, setStaff] = useState(doctors || []);
  const [facilities, setFacilities] = useState(clinics || []);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [q, setQ] = useState("");
  async function save(body: any) {
    setBusy(body.id);
    setError("");
    setMessage("");
    try {
      const r = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setMessage("Changes saved.");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
      return false;
    } finally {
      setBusy("");
    }
  }
  return (
    <>
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
      <label className="field-label" htmlFor="directory-search">
        Search {doctors ? "physicians" : "facilities"}
      </label>
      <input
        id="directory-search"
        className="field max-w-lg mb-8"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name"
      />
      {doctors ? (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Physician</th>
                <th scope="col">Specialty / clinic</th>
                <th scope="col">License</th>
                <th scope="col">Directory status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff
                .filter((d) =>
                  `${d.user?.firstName} ${d.user?.lastName}`
                    .toLowerCase()
                    .includes(q.toLowerCase()),
                )
                .map((d) => (
                  <tr key={d.userId}>
                    <td>
                      Dr. {d.user?.firstName} {d.user?.lastName}
                    </td>
                    <td>
                      {d.specialtyName}
                      <p className="mt-1 text-vela-muted">{d.clinicName}</p>
                    </td>
                    <td>
                      {d.licenseNumber}
                      <p className="text-xs mt-2">
                        {d.isVerified
                          ? "Verified in records"
                          : "Verification pending"}
                      </p>
                    </td>
                    <td>
                      <span className="status">
                        {d.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        disabled={busy === d.userId}
                        className="text-link"
                        onClick={async () => {
                          if (
                            await save({
                              kind: "doctor",
                              id: d.userId,
                              isActive: !d.isActive,
                            })
                          )
                            setStaff(
                              staff.map((x) =>
                                x.userId === d.userId
                                  ? { ...x, isActive: !x.isActive }
                                  : x,
                              ),
                            );
                        }}
                      >
                        {busy === d.userId
                          ? "Saving…"
                          : d.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="stack">
          {facilities
            .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
            .map((c) => (
              <article className="panel" key={c.id}>
                {editing?.id === c.id ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (await save({ kind: "clinic", ...editing })) {
                        setFacilities(
                          facilities.map((x) => (x.id === c.id ? editing : x)),
                        );
                        setEditing(null);
                      }
                    }}
                  >
                    <div className="grid md:grid-cols-3 gap-5">
                      {[
                        ["name", "Clinic name"],
                        ["phone", "Phone"],
                        ["operatingHours", "Operating hours"],
                      ].map(([key, label]) => (
                        <label key={key} className="field-label">
                          {label}
                          <input
                            className="field mt-2"
                            required
                            value={editing[key as keyof Clinic] as string}
                            onChange={(e) =>
                              setEditing({ ...editing, [key]: e.target.value })
                            }
                          />
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        disabled={busy === c.id}
                        className="btn btn-primary"
                      >
                        Save facility
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start gap-5">
                      <div>
                        <h2 className="text-xl">{c.name}</h2>
                        <p className="text-vela-muted mt-3">
                          {c.address}, {c.city}
                        </p>
                        <p className="text-sm mt-2">{c.phone}</p>
                        <p className="text-sm mt-2">{c.operatingHours}</p>
                      </div>
                      <button
                        className="text-link"
                        onClick={() => setEditing(c)}
                      >
                        Edit facility
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
        </div>
      )}
    </>
  );
}
