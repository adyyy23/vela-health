import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAppointmentsForUser } from "@/lib/data";
import { PageHeading, AppointmentRows, EmptyState } from "@/components/CareUI";
export default async function Page() {
  const user = await requireRole(["PATIENT"]);
  const appointments = getAppointmentsForUser(user.id, user.role).sort((a, b) =>
    (b.scheduledDate + b.scheduledTime).localeCompare(
      a.scheduledDate + a.scheduledTime,
    ),
  );
  return (
    <>
      <PageHeading
        eyebrow="Your care"
        title="Every visit, in one place."
        description="Review appointment details, prepare for an upcoming visit, or revisit your care history."
      />
      <Link className="btn btn-primary mb-8" href="/book">
        Book a visit
      </Link>
      {appointments.length ? (
        <AppointmentRows role="patient" appointments={appointments} />
      ) : (
        <EmptyState
          title="No appointments yet"
          description="Choose a physician and find a time that suits you."
          href="/doctors"
          label="Find a physician"
        />
      )}
    </>
  );
}
