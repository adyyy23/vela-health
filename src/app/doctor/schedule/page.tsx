import { requireRole } from "@/lib/auth";
import { getAppointmentsForUser } from "@/lib/data";
import { PageHeading, AppointmentRows, EmptyState } from "@/components/CareUI";
export default async function Page() {
  const user = await requireRole(["DOCTOR"]);
  const appointments = await getAppointmentsForUser(user.id, user.role);
  return (
    <>
      <PageHeading
        eyebrow="CLINICAL SCHEDULE"
        title="Your schedule, in focus."
        description="Review your assigned visits and open the correct patient encounter."
      />
      {appointments.length ? (
        <AppointmentRows appointments={appointments} role="doctor" />
      ) : (
        <EmptyState
          title="No appointments recorded"
          description="Visits booked with you will appear here."
        />
      )}
    </>
  );
}
