import { requireRole } from "@/lib/auth";
import {
  getAdminOverviewMetrics,
  getAllClinics,
  getAppointmentsForUser,
} from "@/lib/data";
import { PageHeading, EmptyState } from "@/components/CareUI";
export default async function Reports() {
  const user = await requireRole(["ADMIN"]);
  const m = await getAdminOverviewMetrics();
  const all = await getAppointmentsForUser(user.id, user.role);
  const clinics = await getAllClinics();
  return (
    <>
      <PageHeading
        eyebrow="NETWORK REPORTING"
        title="Understand your appointment activity."
        description="Counts reflect all recorded appointments, including cancellations. Capacity and wait-time estimates are omitted until sufficient operational data is available."
      />
      <div className="clinical-today-grid">
        <section className="panel">
          <h2 className="text-xl mb-8">Appointments by specialty</h2>
          {m.specialtyStats.length ? (
            m.specialtyStats.map((s) => (
              <div className="mb-6" key={s.name}>
                <div className="flex justify-between gap-4 text-sm">
                  <span>{s.name}</span>
                  <strong>{s.count}</strong>
                </div>
                <div className="h-2 bg-vela-canvasAlt mt-3">
                  <div
                    className="h-full bg-vela-sage"
                    style={{
                      width: `${m.totalAppointments ? (s.count / m.totalAppointments) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No appointments yet"
              description="Specialty activity will appear as visits are recorded."
            />
          )}
        </section>
        <section className="panel">
          <h2 className="text-xl mb-8">Appointments by clinic</h2>
          {clinics.map((c) => (
            <div
              className="py-4 border-t border-vela-border flex justify-between gap-5 text-sm"
              key={c.id}
            >
              <span>{c.name}</span>
              <strong>{all.filter((a) => a.clinicId === c.id).length}</strong>
            </div>
          ))}
          <p className="text-sm mt-8 text-vela-muted">
            Total recorded: {all.length} · Completed:{" "}
            {all.filter((a) => a.status === "COMPLETED").length} · Cancelled:{" "}
            {all.filter((a) => a.status === "CANCELLED").length}
          </p>
        </section>
      </div>
    </>
  );
}
