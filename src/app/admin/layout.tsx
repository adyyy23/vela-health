export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import WorkspaceNav from "@/components/WorkspaceNav";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect(`/${user.role.toLowerCase()}`);
  return (
    <div className="min-h-screen">
      <WorkspaceNav role="ADMIN" name={`${user.firstName} ${user.lastName}`} />
      <main id="main-content" className="workspace-shell">
        {children}
      </main>
    </div>
  );
}
