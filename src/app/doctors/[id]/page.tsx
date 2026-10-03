import ProviderPortrait from "@/components/ProviderPortrait";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import { getDoctorById, getClinicById } from "@/lib/data";
import { PageHeading, EmptyState } from "@/components/CareUI";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = getDoctorById(id);
  if (!d?.isActive) notFound();
  const clinic = d.clinicId ? getClinicById(d.clinicId) : null;
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <Link className="text-link" href="/doctors">
          ← Our physicians
        </Link>
        <PageHeading
          eyebrow={d.specialtyName || "Physician"}
          title={`Dr. ${d.user?.firstName} ${d.user?.lastName}`}
          description={`${d.experienceYears} years of practice · ${d.languages.join(", ")}`}
        />
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <div className="grid sm:grid-cols-[220px_1fr] gap-8 mb-12">
              <ProviderPortrait src={d.user?.avatarUrl} name={`Dr. ${d.user?.firstName} ${d.user?.lastName}`} className="w-full max-w-[220px] h-72 object-cover object-top rounded-card"/>
              <section>
                <h2 className="text-2xl font-semibold mb-5">
                  About your physician
                </h2>
                <p className="text-vela-muted leading-relaxed whitespace-pre-line">
                  {d.bio}
                </p>
                <p className="text-sm mt-6">
                  License listed in directory: {d.licenseNumber}
                </p>
              </section>
            </div>
            <section className="border-t border-vela-border pt-8">
              <h2 className="text-2xl font-semibold mb-6">Clinical services</h2>
              {d.services.length ? (
                d.services.map((s) => (
                  <div
                    key={s.id}
                    className="border-b border-vela-border py-5 flex justify-between gap-6"
                  >
                    <div>
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="text-vela-muted mt-2">{s.description}</p>
                      <p className="text-sm text-vela-muted mt-2">
                        Typical service duration: {s.durationMinutes} minutes
                      </p>
                    </div>
                    <strong>${s.standardFee}</strong>
                  </div>
                ))
              ) : (
                <p className="text-vela-muted">
                  Contact the clinic to confirm services offered.
                </p>
              )}
              <p className="text-sm text-vela-muted mt-6">
                Service fees and duration may differ from a general
                consultation. Confirm specific procedures and insurance coverage
                with the clinic.
              </p>
            </section>
            <section className="border-t border-vela-border mt-10 pt-8">
              <h2 className="text-2xl font-semibold mb-6">
                Patient experiences
              </h2>
              {d.reviews.length ? (
                d.reviews.map((r) => (
                  <article
                    key={r.id}
                    className="border-b border-vela-border py-5"
                  >
                    <p className="font-semibold">
                      {r.patientName} · {r.doctorRating} / 5
                    </p>
                    <p className="text-vela-muted mt-3">
                      {r.comment || "A verified appointment rating."}
                    </p>
                  </article>
                ))
              ) : (
                <EmptyState
                  title="No reviews yet"
                  description="Reviews are accepted from patients after a completed visit."
                />
              )}
            </section>
          </div>
          <aside className="panel p-8 h-fit">
            <p className="eyebrow">Plan your visit</p>
            <h2 className="text-3xl mt-4">${d.consultationFee}</h2>
            <p className="text-vela-muted mt-2">General consultation fee</p>
            <p className="mt-6">{clinic?.name}</p>
            <p className="text-vela-muted mt-2">{clinic?.address}</p>
            {d.inPersonAvailable && (
              <Link
                className="btn btn-primary w-full mt-6"
                href={`/book?doctorId=${d.userId}&type=IN_PERSON`}
              >
                Find in-person times
              </Link>
            )}
            {d.telehealthAvailable && (
              <Link
                className="btn btn-secondary w-full mt-3"
                href={`/book?doctorId=${d.userId}&type=TELEHEALTH`}
              >
                Find virtual times
              </Link>
            )}
            {clinic && (
              <>
                <Link className="text-link mt-6" href={`/clinics/${clinic.id}`}>
                  Clinic details →
                </Link>
                <a
                  className="text-link block mt-4"
                  href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
                >
                  {clinic.phone}
                </a>
              </>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
