"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import VelaLogo from "./VelaLogo";
import NotificationCenter from "./NotificationCenter";
import type { UserRole } from "@/types";
const items = {
  PATIENT: [
    ["/patient", "Overview"],
    ["/patient/appointments", "Appointments"],
    ["/patient/explore", "Find care"],
    ["/patient/documents", "Documents"],
    ["/patient/messages", "Messages"],
    ["/patient/profile", "My profile"],
  ],
  DOCTOR: [
    ["/doctor", "Today"],
    ["/doctor/schedule", "Schedule"],
    ["/doctor/appointments", "Appointments"],
    ["/doctor/patients", "Patients"],
    ["/doctor/messages", "Messages"],
    ["/doctor/availability", "Availability"],
    ["/doctor/profile", "My profile"],
  ],
  ADMIN: [
    ["/admin", "Overview"],
    ["/admin/operations", "Patient flow"],
    ["/admin/appointments", "Appointments"],
    ["/admin/doctors", "Medical staff"],
    ["/admin/clinics", "Facilities"],
    ["/admin/patients", "Patients"],
    ["/admin/reports", "Reports"],
    ["/admin/audit", "Activity"],
  ],
};
export default function WorkspaceNav({
  role,
  name,
}: {
  role: UserRole;
  name: string;
}) {
  const path = usePathname();
  const router = useRouter();
  return (
    <header className="bg-white border-b border-vela-border">
      <div className="workspace-header pt-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <Link href="/" aria-label="VELA Health home">
            <VelaLogo size="sm" />
          </Link>
          <span className="text-sm text-vela-muted border-l border-vela-border pl-5">
            {role === "PATIENT"
              ? "Your care"
              : role === "DOCTOR"
                ? "Clinical workspace"
                : "Network operations"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline">{name}</span>
          <NotificationCenter />
          <button
            className="text-sm underline underline-offset-4"
            onClick={async () => {
              const r = await fetch("/api/auth/logout", { method: "POST" });
              if (r.ok) {
                router.push("/login");
                router.refresh();
              }
            }}
          >
            Sign out
          </button>
        </div>
      </div>
      <nav
        className="workspace-nav page-shell"
        aria-label={`${role.toLowerCase()} navigation`}
      >
        {items[role].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              path === href ||
              (href !== `/${role.toLowerCase()}` && path.startsWith(href))
                ? "page"
                : undefined
            }
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
