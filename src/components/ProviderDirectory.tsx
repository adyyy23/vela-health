"use client";
import ProviderPortrait from "@/components/ProviderPortrait";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeading, EmptyState } from "./CareUI";
import type { DoctorProfile, Specialty } from "@/types";
export default function ProviderDirectory({
  patient = false,
}: {
  patient?: boolean;
}) {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [type, setType] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setSearch(query.get("q") || "");
    setType(query.get("type") || "");
    Promise.all([
      fetch("/api/doctors").then(async (r) => {
        if (!r.ok) throw Error("Unable to load physicians.");
        return r.json();
      }),
      patient
        ? fetch("/api/saved").then(async (r) => {
            if (!r.ok) throw Error("Unable to load saved physicians.");
            return r.json();
          })
        : Promise.resolve(null),
    ])
      .then(([d, s]) => {
        setDoctors(d.doctors);
        setSpecialties(d.specialties);
        setSpecialty(
          d.specialties.find((s: Specialty) =>
            [s.id, s.slug].includes(query.get("specialty") || ""),
          )?.id || "",
        );
        if (s) setSaved(s.saved.doctors.map((d: DoctorProfile) => d.userId));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [patient]);
  async function toggle(id: string) {
    setBusy(id);
    setError("");
    try {
      const r = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType: "DOCTOR", itemId: id }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setSaved((previous) =>
        d.isSaved ? [...previous, id] : previous.filter((v) => v !== id),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save physician.");
    } finally {
      setBusy("");
    }
  }
  const filtered = doctors.filter(
    (d) =>
      (!specialty || d.specialtyId === specialty) &&
      (!type ||
        (type === "TELEHEALTH"
          ? d.telehealthAvailable
          : d.inPersonAvailable)) &&
      (!savedOnly || saved.includes(d.userId)) &&
      [d.user?.firstName, d.user?.lastName, d.specialtyName, d.clinicName].some(
        (v) => v?.toLowerCase().includes(search.toLowerCase()),
      ),
  );
  return (
    <>
      <PageHeading
        eyebrow="Our physicians"
        title={
          patient
            ? "Find your next care partner."
            : "People who make care personal."
        }
        description="Explore the physicians in our network by specialty, clinic, or visit format. Fees and available times are shown before booking."
      />
      <div className="flex flex-wrap items-end gap-4 mb-8">
        <label className="field flex-1 min-w-[180px]">
          Search physicians
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, specialty or clinic"
          />
        </label>
        <label className="field sm:w-60">
          Specialty
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            <option value="">All specialties</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field sm:w-44">
          Visit format
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All formats</option>
            <option value="IN_PERSON">In person</option>
            <option value="TELEHEALTH">Virtual</option>
          </select>
        </label>
        {patient && (
          <button
            className="btn btn-secondary"
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((v) => !v)}
          >
            {savedOnly ? "Show all physicians" : "Saved physicians"}
          </button>
        )}
      </div>
      {error && (
        <p className="error-state mb-6" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading physicians…</p>
      ) : !filtered.length ? (
        <EmptyState
          title="No matching physicians"
          description="Adjust the search, specialty or visit format to explore more options."
        />
      ) : (
        <>
          <p className="text-vela-muted text-sm mb-6" role="status">
            {filtered.length} physicians
          </p>
          <div className="grid lg:grid-cols-2 gap-x-12">
            {filtered.map((d) => (
              <article key={d.userId} className="provider-row">
                <Link href={`/doctors/${d.userId}`}>
                  <ProviderPortrait
                    src={d.user?.avatarUrl}
                    name={`Dr. ${d.user?.firstName} ${d.user?.lastName}`}
                    className=""
                  />
                </Link>
                <div className="min-w-0">
                  <p className="eyebrow">{d.specialtyName}</p>
                  <h2 className="text-xl font-semibold mt-2">
                    Dr. {d.user?.firstName} {d.user?.lastName}
                  </h2>
                  <p className="text-vela-muted mt-2">{d.clinicName}</p>
                  <p className="text-sm mt-3">
                    {d.experienceYears} years of practice · ${d.consultationFee}{" "}
                    consultation
                  </p>
                  <p className="text-sm text-vela-muted mt-2">
                    {d.telehealthAvailable ? "Virtual & " : ""}
                    {d.inPersonAvailable
                      ? "In-person visits"
                      : "virtual visits"}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    <Link className="text-link" href={`/doctors/${d.userId}`}>
                      View profile →
                    </Link>
                    <Link
                      className="text-link"
                      href={`/book?doctorId=${d.userId}`}
                    >
                      Available times →
                    </Link>
                    {patient && (
                      <button
                        className="text-link"
                        disabled={!!busy}
                        aria-pressed={saved.includes(d.userId)}
                        onClick={() => toggle(d.userId)}
                      >
                        {saved.includes(d.userId)
                          ? "Saved · remove"
                          : "Save physician"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
