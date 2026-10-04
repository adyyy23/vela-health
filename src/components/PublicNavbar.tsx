"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import VelaLogo from "./VelaLogo";
const links = [
  { href: "/find-care", label: "Find care" },
  { href: "/doctors", label: "Our physicians" },
  { href: "/clinics", label: "Our clinics" },
  { href: "/services", label: "Specialties" },
  { href: "/telehealth", label: "Virtual care" },
];
export default function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-vela-canvas border-b border-vela-border">
      <div className="page-shell h-20 flex items-center justify-between gap-6">
        <Link href="/" aria-label="VELA Health home">
          <VelaLogo size="md" />
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-7"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className="text-sm hover:underline underline-offset-8"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:flex items-center gap-6 ml-auto xl:ml-0">
          <Link
            href="/patient-app"
            className="text-sm inline-flex items-center gap-2"
          >
            <Download size={17} aria-hidden="true" />
            Get the patient app
          </Link>
          <Link href="/login" className="text-sm">
            Staff sign in
          </Link>
          <Link href="/book" className="btn btn-primary">
            Book a visit
          </Link>
        </div>
        <button
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="public-menu"
          className="xl:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="public-menu"
          aria-label="Mobile navigation"
          className="xl:hidden page-shell pb-6 flex flex-col"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-vela-border"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/care-finder" className="py-3">
            Help me choose care
          </Link>
          <Link
            href="/patient-app"
            className="py-3 inline-flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <Download size={18} aria-hidden="true" />
            Get the patient app
          </Link>
          <Link href="/login" className="py-3">
            Sign in
          </Link>
          <Link href="/book" className="btn btn-primary">
            Book a visit
          </Link>
        </nav>
      )}
    </header>
  );
}
