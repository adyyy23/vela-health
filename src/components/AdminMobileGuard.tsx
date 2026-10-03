"use client";

import React from "react";
import Link from "next/link";
import { Monitor, Smartphone, ArrowRight } from "lucide-react";

export default function AdminMobileGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile Notice (< 768px) */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen p-6 bg-vela-forest text-white text-center font-sans">
        <div className="w-16 h-16 rounded-card bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-xl">
          <Monitor className="w-8 h-8 text-emerald-300" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
          Operations Platform
        </span>
        <h1 className="text-xl font-bold tracking-tight mb-2">
          Admin Portal is optimized for desktop access
        </h1>
        <p className="text-sm text-emerald-100/80 max-w-xs mb-8 leading-relaxed">
          The clinic operations board, patient flows, and audit logs are designed for multi-column workstation screens.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/patient"
            className="flex items-center justify-center gap-2 bg-white text-vela-forest hover:bg-neutral-100 py-3 px-4 rounded-button font-bold text-sm shadow-md transition"
          >
            <Smartphone className="w-4 h-4" />
            <span>Switch to Patient Mobile PWA</span>
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white py-3 px-4 rounded-button font-medium text-sm border border-white/20 transition"
          >
            <span>Back to Public Homepage</span>
          </Link>
        </div>
      </div>

      {/* Desktop view (>= 768px) */}
      <div className="hidden md:flex w-full min-h-screen">
        {children}
      </div>
    </>
  );
}
