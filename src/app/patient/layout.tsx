export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import PatientAccess from "@/components/PatientAccess";
import WorkspaceNav from "@/components/WorkspaceNav";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "PATIENT") redirect(`/${user.role.toLowerCase()}`);
  return (
    <PatientAccess>
      <div className="min-h-screen patient-mobile-shell">
        <WorkspaceNav
          role="PATIENT"
          name={`${user.firstName} ${user.lastName}`}
        />
        <main
          id="patient-mobile-content"
          className="workspace-shell patient-content"
        >
          {children}
        </main>
      </div>
    </PatientAccess>
  );
}
