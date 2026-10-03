"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VelaLogo from "@/components/VelaLogo";
import { Lock, Mail, ArrowRight, Shield, User, Stethoscope, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("patient@velahealth.com");
  const [password, setPassword] = useState("PatientPass123!");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || "Login failed.");
      } else {
        router.push(data.redirectUrl || "/patient");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (role: "PATIENT" | "DOCTOR" | "ADMIN") => {
    if (role === "PATIENT") {
      setEmail("patient@velahealth.com");
      setPassword("PatientPass123!");
    } else if (role === "DOCTOR") {
      setEmail("doctor.reyes@velahealth.com");
      setPassword("DoctorPass123!");
    } else {
      setEmail("admin@velahealth.com");
      setPassword("AdminPass123!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F5F7F5] text-vela-ink">
      <div className="mb-6">
        <Link href="/">
          <VelaLogo size="lg" />
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8E4] shadow-sm max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-vela-ink tracking-tight">
            Sign in to Vela Health
          </h1>
          <p className="text-xs text-vela-muted mt-1">
            Access your patient stream, clinical schedules, or operations board.
          </p>
        </div>

        {/* Quick-fill demo account tabs */}
        <div className="mb-6 bg-[#F7F9F7] p-2.5 rounded-2xl border border-[#E2E8E4]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-vela-muted block mb-2 px-1">
            1-Click Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => quickFill("PATIENT")}
              className={`py-2 px-2 rounded-xl font-semibold transition ${
                email.includes("patient")
                  ? "bg-vela-sage text-white shadow-sm"
                  : "bg-white text-vela-ink hover:bg-[#EFF2EF] border border-[#E2E8E4]"
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => quickFill("DOCTOR")}
              className={`py-2 px-2 rounded-xl font-semibold transition ${
                email.includes("doctor")
                  ? "bg-vela-sage text-white shadow-sm"
                  : "bg-white text-vela-ink hover:bg-[#EFF2EF] border border-[#E2E8E4]"
              }`}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => quickFill("ADMIN")}
              className={`py-2 px-2 rounded-xl font-semibold transition ${
                email.includes("admin")
                  ? "bg-vela-sage text-white shadow-sm"
                  : "bg-white text-vela-ink hover:bg-[#EFF2EF] border border-[#E2E8E4]"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-vela-muted block mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-vela-muted absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F9F7] border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-vela-muted block mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-vela-muted absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F9F7] border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E2E8E4] text-center text-xs text-vela-muted">
          <span>New patient? </span>
          <Link href="/register" className="font-bold text-vela-sage hover:text-vela-sageDark">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
