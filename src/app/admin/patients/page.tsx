import { requireRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { PageHeading } from "@/components/CareUI";
import PatientDirectory from "@/components/PatientDirectory";
export default async function Patients() {
  await requireRole(["ADMIN"]);
  const patients = await getDb()
    .prepare(
      `SELECT u.id,u.first_name || ' ' || u.last_name AS name,u.email,u.phone,COUNT(a.id) AS visits FROM users u LEFT JOIN appointments a ON a.patient_id=u.id WHERE u.role='PATIENT' GROUP BY u.id ORDER BY name`,
    )
    .all();
  return (
    <>
      <PageHeading
        eyebrow="PATIENT ACCOUNTS"
        title="Your patient register."
        description="Find registered patients and review contact details and booking counts."
      />
      <PatientDirectory patients={patients as any[]} />
    </>
  );
}
