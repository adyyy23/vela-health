"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import VelaLogo from "./VelaLogo";
import { Calendar, Menu, X, ArrowRight } from "lucide-react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/find-care", label: "Find Care" },
    { href: "/doctors", label: "Doctors" },
    { href: "/clinics", label: "Clinics" },
    { href: "/services", label: "Services" },
    { href: "/care-finder", label: "Care Finder" },
    { href: "/telehealth", label: "Telehealth" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-vela-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-95 transition">
          <VelaLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium transition ${
                  isActive
                    ? "text-vela-forest font-bold border-b-2 border-vela-sage pb-0.5"
                    : "text-vela-inkMuted hover:text-vela-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3.5">
          <Link
            href="/login"
            className="text-xs font-semibold text-vela-ink hover:text-vela-sage transition px-2 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-vela-sage hover:bg-vela-sageDark px-3.5 py-2 rounded-button shadow-sm transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/book"
            className="text-xs font-bold text-white bg-vela-sage hover:bg-vela-sageDark px-3 py-1.5 rounded-button"
          >
            Book
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-vela-ink hover:bg-vela-surfaceSubtle rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-vela-border px-4 py-3 flex flex-col gap-1.5 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-xs font-medium text-vela-ink hover:text-vela-sage transition"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-vela-muted" />
            </Link>
          ))}
          <div className="pt-2.5 mt-1 border-t border-vela-border flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-vela-ink"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-vela-sage"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
