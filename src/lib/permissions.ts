import type { Appointment, AppointmentStatus, User } from "@/types";
export function canAccessAppointment(user: User, a: Appointment) {
  return (
    user.role === "ADMIN" ||
    (user.role === "DOCTOR" && a.doctorId === user.id) ||
    (user.role === "PATIENT" && a.patientId === user.id)
  );
}
const transitions: Record<string, AppointmentStatus[]> = {
  REQUESTED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "IN_CONSULTATION", "CANCELLED", "NO_SHOW"],
  UPCOMING: ["CHECKED_IN", "IN_CONSULTATION", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["IN_CONSULTATION", "CANCELLED", "NO_SHOW"],
  IN_CONSULTATION: ["COMPLETED"],
  RESCHEDULED: ["CONFIRMED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};
export function canChangeStatus(
  user: User,
  a: Appointment,
  status: AppointmentStatus,
) {
  return (
    canAccessAppointment(user, a) &&
    (transitions[a.status] || []).includes(status) &&
    (user.role !== "PATIENT" || status === "CANCELLED")
  );
}
