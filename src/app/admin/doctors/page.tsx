import { requireRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDoctorById } from "@/lib/data";
import { PageHeading } from "@/components/CareUI";
import NetworkDirectory from "@/components/NetworkDirectory";
import type { DoctorProfile } from "@/types";
export default async function Staff() {
  await requireRole(["ADMIN"]);
  const rows = (await getDb()
    .prepare("SELECT user_id FROM doctor_profiles")
    .all()) as {
    user_id: string;
  }[];
  const doctors = (
    await Promise.all(rows.map((d) => getDoctorById(d.user_id)))
  ).filter(Boolean) as DoctorProfile[];
  return (
    <>
      <PageHeading
        eyebrow="MEDICAL STAFF"
        title="Manage your physician directory."
        description="Review recorded credentials and activate or deactivate public booking access. Existing encounters remain available to their assigned clinician."
      />
      <NetworkDirectory doctors={doctors} />
    </>
  );
}
