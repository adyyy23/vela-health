import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAppointmentsForUser } from "@/lib/data";
import { clinicDate, visitLabel } from "@/lib/care-time";
import { PageHeading, EmptyState, AppointmentRows } from "@/components/CareUI";
export default async function DoctorToday() {
  const user = await requireRole(["DOCTOR"]);
  const all = getAppointmentsForUser(user.id, user.role);
  const today = all.filter((a) => a.scheduledDate === clinicDate());
  const active = today.filter(
    (a) => !["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status),
  );
  const next =
    active.find((a) => a.status === "IN_CONSULTATION") ||
    active.find((a) => a.status === "CHECKED_IN") ||
    active[0];
  return (
    <>
      <PageHeading
        eyebrow="CLINICAL WORKSPACE"
        title="Today, at a glance."
        description={`${new Date(clinicDate() + "T12:00:00Z").toLocaleDateString("en-US", { dateStyle: "full", timeZone: "UTC" })} · Clinic times are shown in Pacific Time.`}
      />
      <div className="metric-strip">
        <div>
          <strong>{today.length}</strong>
          <span>Scheduled today</span>
        </div>
        <div>
          <strong>
            {today.filter((a) => a.status === "CHECKED_IN").length}
          </strong>
          <span>Checked in</span>
        </div>
        <div>
          <strong>
            {today.filter((a) => a.status === "IN_CONSULTATION").length}
          </strong>
          <span>In consultation</span>
        </div>
        <div>
          <strong>
            {today.filter((a) => a.status === "COMPLETED").length}
          </strong>
          <span>Completed</span>
        </div>
      </div>
      <div className="clinical-today-grid">
        <section>
          {next ? (
            <div className="panel">
              <p className="eyebrow">NEXT ENCOUNTER</p>
              <h2 className="text-3xl mt-6">{next.patientName}</h2>
              <p className="mt-2 text-vela-muted">
                {visitLabel(next.scheduledDate, next.scheduledTime)} ·{" "}
                {next.consultationType === "TELEHEALTH"
                  ? "Virtual"
                  : "In person"}
              </p>
              <p className="mt-8 text-lg">{next.reason}</p>
              <div className="flex gap-4 flex-wrap mt-8">
                <Link
                  className="btn btn-primary"
                  href={`/doctor/workspace/${next.id}`}
                >
                  Open clinical workspace
                </Link>
                <Link className="btn btn-secondary" href="/doctor/messages">
                  Messages
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No active encounters"
              description="Your remaining appointments will appear here."
            />
          )}
        </section>
        <aside className="panel">
          <p className="eyebrow">PRACTICE TOOLS</p>
          <h2 className="text-xl mt-4">Keep your practice in sync.</h2>
          <div className="stack mt-6">
            <Link className="text-link" href="/doctor/availability">
              Manage appointment availability
            </Link>
            <Link className="text-link" href="/doctor/patients">
              Review your patient panel
            </Link>
            <Link className="text-link" href="/doctor/profile">
              Update your public profile
            </Link>
          </div>
        </aside>
      </div>
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-5">Today’s schedule</h2>
        {today.length ? (
          <AppointmentRows appointments={today} role="doctor" />
        ) : (
          <EmptyState
            title="No appointments today"
            description="Review your full schedule or update your availability."
            href="/doctor/schedule"
            label="View schedule"
          />
        )}
      </section>
    </>
  );
}
