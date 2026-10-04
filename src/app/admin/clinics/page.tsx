import { requireRole } from "@/lib/auth";
import { getAllClinics } from "@/lib/data";
import { PageHeading } from "@/components/CareUI";
import NetworkDirectory from "@/components/NetworkDirectory";
export default async function Clinics() {
  await requireRole(["ADMIN"]);
  return (
    <>
      <PageHeading
        eyebrow="FACILITIES"
        title="Your clinics, connected."
        description="Keep facility names, contact numbers, and published opening hours up to date."
      />
      <NetworkDirectory clinics={await getAllClinics()} />
    </>
  );
}
