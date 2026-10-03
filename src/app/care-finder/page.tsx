"use client";
import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { PageHeading } from "@/components/CareUI";
import { CARE_FINDER_CATEGORIES } from "@/lib/constants";
export default function Page() {
  const [selected, setSelected] = useState(CARE_FINDER_CATEGORIES[0]);
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <PageHeading
          eyebrow="Guided discovery"
          title="Let’s find your starting point."
          description="Explore common reasons for a visit and the specialties that provide related care. This directory guide does not diagnose conditions or determine urgency."
        />
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
          <nav aria-label="Care interests">
            {CARE_FINDER_CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`w-full text-left py-5 px-4 border-t border-vela-border ${selected.id === c.id ? "bg-vela-surfaceSubtle" : ""}`}
                aria-pressed={selected.id === c.id}
                onClick={() => setSelected(c)}
              >
                <span className="font-semibold">{c.title}</span>
                <span className="block text-sm text-vela-muted mt-2">
                  {c.commonSymptoms.join(" · ")}
                </span>
              </button>
            ))}
          </nav>
          <section className="panel p-8 h-fit">
            <p className="eyebrow">Explore related care</p>
            <h2 className="text-3xl mt-4">{selected.title}</h2>
            <p className="text-vela-muted mt-5 leading-relaxed">
              {selected.description}
            </p>
            <h3 className="font-semibold mt-8">Before your consultation</h3>
            <p className="text-vela-muted mt-3">
              Prepare your questions, medication list, and relevant records. If
              you are unsure which physician to see, contact the clinic for help
              arranging a visit.
            </p>
            <Link
              className="btn btn-primary mt-8"
              href={`/doctors?specialty=${selected.specialtySlug}`}
            >
              Explore physicians
            </Link>
          </section>
        </div>
        <p className="notice mt-10">
          For emergencies or symptoms that need immediate attention, contact
          your local emergency services. Do not wait for an online appointment.
        </p>
      </main>
    </>
  );
}
