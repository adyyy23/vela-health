import { requireRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { PageHeading } from "@/components/CareUI";
import PatientDirectory from "@/components/PatientDirectory";
export default async function Patients() {
  const user = await requireRole(["DOCTOR"]);
  const patients = await getDb()
    .prepare(
      `SELECT u.id,u.first_name || ' ' || u.last_name AS name,u.email,u.phone,p.date_of_birth,p.blood_type,COUNT(a.id) AS visits,MAX(a.scheduled_date) AS last_visit FROM users u JOIN appointments a ON a.patient_id=u.id LEFT JOIN patient_profiles p ON p.user_id=u.id WHERE a.doctor_id=? GROUP BY u.id,p.user_id ORDER BY name`,
    )
    .all(user.id);
  return (
    <>
      <PageHeading
        eyebrow="YOUR PATIENT PANEL"
        title="People in your care."
        description="Patients with recorded appointments assigned to you. Clinical details are shown only where recorded."
      />
      <PatientDirectory clinical patients={patients as any[]} />
    </>
  );
}
