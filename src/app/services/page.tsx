import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { PageHeading } from "@/components/CareUI";
import { getAllSpecialties, getDoctors } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function Page() {
  const specialties = await getAllSpecialties();
  const doctors = await getDoctors({});
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <PageHeading
          eyebrow="Our specialties"
          title="Care for every chapter."
          description="Explore the specialties represented across the VELA network, then choose a physician whose practice fits your needs."
        />
        <div>
          {specialties.map((s, i) => (
            <section
              key={s.id}
              className="grid md:grid-cols-[80px_1fr_250px] gap-5 py-8 border-t border-vela-border"
            >
              <span className="text-vela-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-2xl font-semibold">{s.name}</h2>
                <p className="text-vela-muted mt-3 max-w-2xl">
                  {s.description}
                </p>
                <p className="mt-4 text-sm">
                  {doctors.filter((d) => d.specialtyId === s.id).length}{" "}
                  physicians in the network
                </p>
              </div>
              <div className="flex md:flex-col gap-3 items-start">
                <Link
                  className="btn btn-primary"
                  href={`/doctors?specialty=${s.id}`}
                >
                  Meet your specialists
                </Link>
                <Link className="text-link" href={`/book?specialty=${s.id}`}>
                  Find appointment times →
                </Link>
              </div>
            </section>
          ))}
        </div>
        <p className="border-t border-vela-border pt-8 text-vela-muted">
          Specific tests, procedures, insurance coverage and payment
          arrangements should be confirmed with your clinic.
        </p>
      </main>
    </>
  );
}
