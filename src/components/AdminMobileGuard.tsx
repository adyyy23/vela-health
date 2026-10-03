"use client";

import React from "react";
import Link from "next/link";
import { Monitor, Smartphone, ArrowRight } from "lucide-react";

export default function AdminMobileGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile Notice (< 768px) */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900 text-white text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
          <Monitor className="w-8 h-8 text-sky-400" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
          Operations Platform
        </span>
        <h1 className="text-xl font-bold tracking-tight mb-2">
          Admin Portal is optimized for desktop access
        </h1>
        <p className="text-sm text-slate-400 max-w-xs mb-8 leading-relaxed">
          The clinic operations board, patient flows, and audit logs are designed for multi-column workstation screens.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/patient"
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 px-4 rounded-2xl font-semibold text-sm shadow-md"
          >
            <Smartphone className="w-4 h-4" />
            <span>Switch to Patient Mobile PWA</span>
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 px-4 rounded-2xl font-medium text-sm border border-slate-700"
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
