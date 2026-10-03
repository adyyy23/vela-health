"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import VelaLogo from "./VelaLogo";
import { Search, Calendar, Menu, X, ArrowRight, Sparkles } from "lucide-react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/find-care", label: "Find Care" },
    { href: "/doctors", label: "Doctors" },
    { href: "/clinics", label: "Clinics" },
    { href: "/care-finder", label: "Care Finder", highlight: true },
    { href: "/telehealth", label: "Telehealth" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <VelaLogo size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-100 text-sky-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-sky-500" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100/70 transition"
            >
              Sign In
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 px-5 py-2 rounded-full shadow-sm hover:shadow transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/book"
              className="text-xs font-semibold text-white bg-sky-600 px-3.5 py-1.5 rounded-full"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-3xl border border-slate-200/80 shadow-xl p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-medium"
              >
                <div className="flex items-center gap-2">
                  {link.highlight && <Sparkles className="w-4 h-4 text-sky-500" />}
                  <span>{link.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
            <hr className="my-1 border-slate-100" />
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-2xl"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
