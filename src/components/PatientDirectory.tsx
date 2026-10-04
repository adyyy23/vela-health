"use client";
import { useState } from "react";
import Link from "next/link";
import { EmptyState } from "./CareUI";
export default function PatientDirectory({
  patients,
  clinical = false,
}: {
  patients: any[];
  clinical?: boolean;
}) {
  const [q, setQ] = useState("");
  const filtered = patients.filter((p) =>
    `${p.name} ${p.email}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <label htmlFor="patient-search" className="field-label">
        Search patients
      </label>
      <input
        id="patient-search"
        className="field max-w-lg mb-8"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Name or email"
      />
      {filtered.length ? (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Contact</th>
                <th scope="col">Visits</th>
                {clinical && <th scope="col">Last visit</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    {clinical && (
                      <p className="text-xs text-vela-muted mt-2">
                        DOB: {p.date_of_birth || "Not recorded"} · Blood type:{" "}
                        {p.blood_type || "Not recorded"}
                      </p>
                    )}
                  </td>
                  <td>
                    {p.email}
                    <p className="mt-1 text-vela-muted">
                      {p.phone || "No phone recorded"}
                    </p>
                  </td>
                  <td>{p.visits}</td>
                  {clinical && (
                    <td>
                      {p.last_visit || "No visits"}
                      <p className="mt-2">
                        <Link href="/doctor/appointments" className="text-link">
                          Find encounter
                        </Link>
                      </p>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No matching patients"
          description="Try another name or email."
        />
      )}
    </>
  );
}
