"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Heart,
  Shield,
  FileText,
  Bookmark,
  Bell,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Hourglass,
} from "lucide-react";

export default function PatientProfilePage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 text-vela-ink">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage block">
          Account & Preferences
        </span>
        <h1 className="text-2xl font-extrabold text-vela-ink tracking-tight">
          Patient Profile
        </h1>
      </div>

      {/* User Header Card */}
      <div className="bg-white rounded-card p-5 border border-[#E2E8E4] shadow-sm flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
          alt="Maria Santos"
          className="w-16 h-16 rounded-full object-cover border-2 border-[#E2E8E4]"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-vela-ink">Maria Clara Santos</h2>
            <CheckCircle2 className="w-4 h-4 text-vela-sage" />
          </div>
          <span className="text-xs text-vela-muted">patient@velahealth.com</span>
          <span className="text-[11px] text-vela-muted block mt-0.5">+1 (415) 555-0142</span>
        </div>
      </div>

      {/* Clinical & Emergency Info */}
      <div className="bg-white rounded-card p-5 border border-[#E2E8E4] shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-vela-muted mb-2">
          Clinical Baseline
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4]">
            <span className="text-[10px] text-vela-muted font-bold uppercase block">Blood Type</span>
            <span className="font-extrabold text-vela-ink text-sm">O Positive (O+)</span>
          </div>

          <div className="p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4]">
            <span className="text-[10px] text-vela-muted font-bold uppercase block">Date of Birth</span>
            <span className="font-bold text-vela-ink text-sm">April 18, 1995</span>
          </div>
        </div>

        <div className="p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs">
          <span className="text-[10px] text-vela-muted font-bold uppercase block">Emergency Contact</span>
          <span className="font-bold text-vela-ink block mt-0.5">Carlos Santos (Spouse)</span>
          <span className="text-vela-muted text-[11px]">+1 (415) 555-0199</span>
        </div>
      </div>

      {/* Care Shortcuts */}
      <div className="bg-white rounded-card p-2 border border-[#E2E8E4] shadow-sm flex flex-col gap-1">
        <Link
          href="/patient/documents"
          className="flex items-center justify-between p-3 rounded-button hover:bg-vela-surfaceSubtle transition text-xs font-semibold text-vela-ink"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-vela-sage" />
            <span>Visit Summaries & Prescriptions</span>
          </div>
          <ChevronRight className="w-4 h-4 text-vela-muted" />
        </Link>

        <Link
          href="/patient/appointments"
          className="flex items-center justify-between p-3 rounded-button hover:bg-vela-surfaceSubtle transition text-xs font-semibold text-vela-ink"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-vela-sage" />
            <span>Care History & Past Consultations</span>
          </div>
          <ChevronRight className="w-4 h-4 text-vela-muted" />
        </Link>

        <div className="flex items-center justify-between p-3 rounded-button text-xs font-semibold text-vela-ink">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-vela-sage" />
            <span>Check-In Push Notifications</span>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-4 h-4 accent-vela-sage rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-button bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of Patient Account</span>
      </button>
    </div>
  );
}
