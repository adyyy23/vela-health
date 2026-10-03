import Link from "next/link";
import { requireRole } from "@/lib/auth";
import {
  getAdminOverviewMetrics,
  getAppointmentsForUser,
  getAllClinics,
} from "@/lib/data";
import { clinicDate } from "@/lib/care-time";
import { PageHeading, AppointmentRows, EmptyState } from "@/components/CareUI";
export default async function AdminHome() {
  const user = await requireRole(["ADMIN"]);
  const metrics = getAdminOverviewMetrics();
  const appointments = getAppointmentsForUser(user.id, user.role).filter(
    (a) => a.scheduledDate === clinicDate(),
  );
  const clinics = getAllClinics();
  return (
    <>
      <PageHeading
        eyebrow="NETWORK OPERATIONS"
        title="A clear view of your network."
        description="Appointments and directory counts from your current records. Clinic times use Pacific Time."
      />
      <div className="metric-strip">
        {[
          [metrics.totalPatients, "Registered patients"],
          [metrics.activeDoctors, "Active physicians"],
          [appointments.length, "Appointments today"],
          [metrics.totalClinics, "Network clinics"],
        ].map(([n, label]) => (
          <div key={label}>
            <strong>{n}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <h2 className="text-2xl">Today’s appointments</h2>
        <Link href="/admin/operations" className="btn btn-primary">
          Open patient flow
        </Link>
      </div>
      {appointments.length ? (
        <AppointmentRows appointments={appointments} role="admin" />
      ) : (
        <EmptyState
          title="No appointments today"
          description="New bookings will appear in the appointment register."
        />
      )}
      <section className="mt-10">
        <h2 className="text-2xl mb-6">Clinic activity today</h2>
        <div className="clinic-editorial">
          {clinics.map((c) => (
            <Link key={c.id} href="/admin/clinics">
              <div>
                <h3>{c.name}</h3>
                <p>
                  {appointments.filter((a) => a.clinicId === c.id).length}{" "}
                  appointments · {c.doctorCount} physicians
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
