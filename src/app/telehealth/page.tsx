import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { PageHeading } from "@/components/CareUI";
export default function Page() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <PageHeading
          eyebrow="Virtual care"
          title="Care that meets you where you are."
          description="Schedule a virtual consultation with a VELA physician. Your clinic will confirm whether a virtual visit is appropriate and provide connection instructions."
        />
        <Link className="btn btn-primary" href="/book?type=TELEHEALTH">
          Find a virtual appointment
        </Link>
        <div className="grid md:grid-cols-3 gap-10 my-16">
          {[
            [
              "01",
              "Choose your physician",
              "Browse physicians who offer virtual appointments and choose an available time.",
            ],
            [
              "02",
              "Prepare for your visit",
              "Use a quiet, private space and have your medications and questions ready. Contact the clinic if you have not received connection instructions.",
            ],
            [
              "03",
              "Continue your care",
              "Review the documents your physician publishes after the consultation, and use your appointment conversation for follow-up questions.",
            ],
          ].map(([n, t, d]) => (
            <section key={n} className="border-t border-vela-border pt-6">
              <p className="eyebrow">{n}</p>
              <h2 className="text-xl mt-4 font-semibold">{t}</h2>
              <p className="text-vela-muted mt-3">{d}</p>
            </section>
          ))}
        </div>
        <section className="panel p-8">
          <h2 className="text-xl font-semibold">Before you book</h2>
          <p className="mt-3 max-w-3xl text-vela-muted">
            VELA currently manages virtual appointment scheduling and visit
            records. Video calls and pharmacy delivery are not integrated into
            this portal. Some concerns require an in-person examination; your
            clinic can help you choose the right visit.
          </p>
          <Link
            className="text-link inline-block mt-5"
            href="/doctors?type=TELEHEALTH"
          >
            Browse virtual-care physicians →
          </Link>
        </section>
      </main>
    </>
  );
}
