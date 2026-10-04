import ProviderPortrait from "@/components/ProviderPortrait";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import { getClinicById, getDoctors } from "@/lib/data";
import { PageHeading, EmptyState } from "@/components/CareUI";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getClinicById(id);
  if (!c) notFound();
  const doctors = await getDoctors({ clinicId: c.id });
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <Link className="text-link" href="/clinics">
          ← Our clinics
        </Link>
        <PageHeading
          eyebrow={c.city}
          title={c.name}
          description={`${c.address}, ${c.city}, ${c.state} ${c.postalCode}`}
        />
        <img
          className="w-full h-[300px] md:h-[460px] object-cover rounded-card mb-12"
          src={c.imageUrl}
          alt={`${c.name} care environment`}
        />
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Your visit, made easier.
            </h2>
            <dl className="space-y-7">
              <div>
                <dt className="font-semibold">Opening hours</dt>
                <dd className="text-vela-muted mt-2">{c.operatingHours}</dd>
              </div>
              <div>
                <dt className="font-semibold">Accessibility</dt>
                <dd className="text-vela-muted mt-2">
                  {c.accessibilityInfo ||
                    "Contact reception to discuss your access requirements."}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Parking</dt>
                <dd className="text-vela-muted mt-2">
                  {c.parkingInfo || "Ask reception about local parking."}
                </dd>
              </div>
            </dl>
            <h2 className="text-2xl font-semibold mt-12 mb-6">
              Physicians at this clinic
            </h2>
            {doctors.length ? (
              doctors.map((d) => (
                <article className="provider-row" key={d.userId}>
                  <ProviderPortrait
                    src={d.user?.avatarUrl}
                    name={`Dr. ${d.user?.firstName} ${d.user?.lastName}`}
                    className=""
                  />
                  <div>
                    <p className="eyebrow">{d.specialtyName}</p>
                    <h3 className="text-xl mt-3">
                      Dr. {d.user?.firstName} {d.user?.lastName}
                    </h3>
                    <p className="text-vela-muted mt-2">
                      ${d.consultationFee} consultation
                    </p>
                    <Link
                      className="text-link mt-5"
                      href={`/doctors/${d.userId}`}
                    >
                      Meet physician →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState
                title="No physicians currently listed"
                description="Contact reception to discuss care at this location."
              />
            )}
          </div>
          <aside className="panel p-8 h-fit">
            <p className="eyebrow">Clinic reception</p>
            <h2 className="text-xl mt-4">We’re here to help.</h2>
            <a
              className="text-link mt-5"
              href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
            >
              {c.phone}
            </a>
            <a
              className="text-link block mt-4 break-all"
              href={`mailto:${c.email}`}
            >
              {c.email}
            </a>
            <Link
              className="btn btn-primary w-full mt-7"
              href={`/book?clinicId=${c.id}`}
            >
              Find appointment times
            </Link>
            <a
              className="btn btn-secondary w-full mt-3"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address + ", " + c.city)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
            </a>
            <p className="text-sm text-vela-muted mt-6">
              Confirm insurance coverage, procedures, and payment arrangements
              with reception before your appointment.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}
