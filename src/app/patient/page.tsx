import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAppointmentsForUser, getPatientDocuments } from "@/lib/data";
import { clinicDate, visitLabel } from "@/lib/care-time";
import { PageHeading, EmptyState, AppointmentRows } from "@/components/CareUI";
export default async function PatientHome() {
  const user = await requireRole(["PATIENT"]);
  const appointments = await getAppointmentsForUser(user.id, user.role);
  const upcoming = appointments
    .filter(
      (a) =>
        a.scheduledDate >= clinicDate() &&
        ["CONFIRMED", "UPCOMING", "CHECKED_IN", "IN_CONSULTATION"].includes(
          a.status,
        ),
    )
    .sort((a, b) =>
      (a.scheduledDate + a.scheduledTime).localeCompare(
        b.scheduledDate + b.scheduledTime,
      ),
    );
  const next = upcoming[0];
  const documents = await getPatientDocuments(user.id);
  return (
    <>
      <PageHeading
        eyebrow="YOUR CARE, CONNECTED"
        title={`Welcome, ${user.firstName}.`}
        description="A clear view of your appointments, care team, and next steps."
      />
      <div className="patient-home-grid">
        <section className="stack">
          <h2 className="text-xl font-semibold">Your next visit</h2>
          {next ? (
            <article className="next-visit">
              <span className="status">{next.status.replaceAll("_", " ")}</span>
              <h3 className="text-3xl mt-6">{next.doctorName}</h3>
              <p className="mt-2">{next.doctorSpecialty}</p>
              <p className="text-lg mt-8">
                {visitLabel(next.scheduledDate, next.scheduledTime)}
              </p>
              <p className="mt-2 text-sm">
                {next.clinicName} ·{" "}
                {next.consultationType === "TELEHEALTH"
                  ? "Virtual visit"
                  : "In person"}
              </p>
              <Link
                className="btn bg-white text-vela-ink mt-8"
                href={`/patient/appointments/${next.id}`}
              >
                Manage this visit
              </Link>
            </article>
          ) : (
            <EmptyState
              title="Your next chapter starts here"
              description="You have no upcoming appointments."
              href="/book"
              label="Book a visit"
            />
          )}
          <h2 className="text-xl font-semibold mt-6">Care timeline</h2>
          {appointments.length ? (
            <AppointmentRows
              appointments={appointments.slice(0, 5)}
              role="patient"
            />
          ) : (
            <EmptyState
              title="No visits yet"
              description="Your visits will appear here after booking."
            />
          )}
        </section>
        <aside className="stack">
          <div className="panel">
            <p className="eyebrow">BEFORE YOUR VISIT</p>
            <h2 className="text-xl mt-4">Come prepared.</h2>
            <ul className="preparation-list">
              <li>Bring a current medication list.</li>
              <li>Note your questions and recent symptoms.</li>
              <li>Bring relevant records and identification.</li>
              <li>Confirm coverage and fees with your clinic.</li>
            </ul>
            <p className="text-xs text-vela-muted mt-5">
              Digital check-in opens 20 minutes before an in-person visit.
            </p>
          </div>
          <div className="panel">
            <h2 className="text-xl">Your documents</h2>
            <p className="text-vela-muted mt-3">
              {documents.length
                ? `${documents.length} document${documents.length === 1 ? "" : "s"} shared by your care team.`
                : "Visit summaries appear here when your physician publishes them."}
            </p>
            <Link href="/patient/documents" className="text-link mt-6">
              Open document center
            </Link>
          </div>
          <div className="panel">
            <h2 className="text-xl">Stay in touch</h2>
            <p className="text-vela-muted mt-3">
              Message the physicians you have booked with. For urgent concerns,
              contact your clinic directly.
            </p>
            <Link href="/patient/messages" className="text-link mt-6">
              Open messages
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
