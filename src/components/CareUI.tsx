import Link from "next/link";
import type { Appointment } from "@/types";
import { visitLabel } from "@/lib/care-time";
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
export function EmptyState({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="empty-state">
      <h2 className="text-lg font-semibold text-vela-ink">{title}</h2>
      <p className="mt-2">{description}</p>
      {href && (
        <Link className="btn btn-secondary mt-5" href={href}>
          {label}
        </Link>
      )}
    </div>
  );
}
export function AppointmentRows({
  appointments,
  role,
}: {
  appointments: Appointment[];
  role: "patient" | "doctor" | "admin";
}) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Visit</th>
            <th scope="col">{role === "patient" ? "Physician" : "Patient"}</th>
            <th scope="col">Clinic / format</th>
            <th scope="col">Status</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>
                <strong>{visitLabel(a.scheduledDate, a.scheduledTime)}</strong>
                <p className="text-vela-muted text-xs mt-1">{a.reason}</p>
              </td>
              <td>{role === "patient" ? a.doctorName : a.patientName}</td>
              <td>
                {a.clinicName}
                <p className="text-vela-muted text-xs mt-1">
                  {a.consultationType === "TELEHEALTH"
                    ? "Virtual visit"
                    : "In person"}
                </p>
              </td>
              <td>
                <span className="status">
                  {a.status.replaceAll("_", " ").toLowerCase()}
                </span>
              </td>
              <td>
                {role !== "admin" ? (
                  <Link
                    className="text-link"
                    href={
                      role === "patient"
                        ? `/patient/appointments/${a.id}`
                        : `/doctor/workspace/${a.id}`
                    }
                  >
                    {role === "patient" ? "View visit" : "Open encounter"}
                  </Link>
                ) : (
                  a.referenceNo
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
