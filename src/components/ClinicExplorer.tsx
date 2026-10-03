"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageHeading, EmptyState } from "./CareUI";
import type { Clinic } from "@/types";
const CareMap = dynamic(() => import("./CareMap"), {
  ssr: false,
  loading: () => (
    <p className="p-6" role="status">
      Loading clinic map…
    </p>
  ),
});
export default function ClinicExplorer() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [map, setMap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/clinics")
      .then(async (r) => {
        if (!r.ok) throw Error("Unable to load clinics.");
        return r.json();
      })
      .then((d) => setClinics(d.clinics || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const filtered = clinics.filter((c) =>
    [c.name, c.address, c.city].some((v) =>
      v.toLowerCase().includes(query.toLowerCase()),
    ),
  );
  return (
    <>
      <PageHeading
        eyebrow="Find care"
        title="A place for your care, close to home."
        description="Explore the VELA clinic network. Check each location’s hours, access information, and physicians before booking."
      />
      <div className="flex gap-4 flex-wrap items-end mb-8">
        <label className="field flex-1 max-w-xl">
          Search clinics
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Clinic, neighborhood or address"
          />
        </label>
        <button
          className="btn btn-secondary"
          aria-pressed={map}
          onClick={() => setMap((v) => !v)}
        >
          {map ? "Hide map" : "Show map"}
        </button>
        <Link className="text-link" href="/doctors">
          Find a physician instead →
        </Link>
      </div>
      {error && (
        <p role="alert" className="error-state mb-6">
          {error}
        </p>
      )}
      {map && (
        <div className="h-[420px] border border-vela-border mb-10 relative z-0">
          <CareMap
            clinics={filtered}
            selectedClinicId={selected}
            onSelectClinic={(c) => setSelected(c.id)}
          />
        </div>
      )}
      {loading ? (
        <p role="status">Loading clinics…</p>
      ) : filtered.length ? (
        <div className="space-y-10">
          {filtered.map((c) => (
            <article
              key={c.id}
              className={`grid md:grid-cols-[minmax(240px,35%)_1fr] gap-8 border-t pt-8 ${selected === c.id ? "border-vela-sage" : "border-vela-border"}`}
            >
              <img
                className="w-full h-64 object-cover rounded-card"
                src={c.imageUrl}
                alt={`${c.name} care environment`}
                loading="lazy"
              />
              <div>
                <p className="eyebrow">
                  {c.city} · {c.doctorCount} physicians
                </p>
                <h2 className="text-2xl font-semibold mt-3">{c.name}</h2>
                <p className="text-vela-muted mt-4">
                  {c.address}, {c.city}, {c.state} {c.postalCode}
                </p>
                <p className="mt-3">{c.operatingHours}</p>
                <a
                  className="text-link inline-block mt-3"
                  href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                >
                  {c.phone}
                </a>
                <div className="flex gap-3 flex-wrap mt-6">
                  <Link className="btn btn-primary" href={`/clinics/${c.id}`}>
                    Explore clinic
                  </Link>
                  <Link
                    className="btn btn-secondary"
                    href={`/book?clinicId=${c.id}`}
                  >
                    Check appointment times
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No clinics found"
          description="Try another clinic name or neighborhood."
        />
      )}
    </>
  );
}
