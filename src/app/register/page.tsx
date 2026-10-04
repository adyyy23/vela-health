"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VelaLogo from "@/components/VelaLogo";
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || "Registration failed.");
      } else {
        router.push("/patient");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-vela-ink"
    >
      <div className="mb-6">
        <Link href="/">
          <VelaLogo size="lg" />
        </Link>
      </div>

      <div className="bg-white rounded-surface p-6 sm:p-10 border border-[#DCD8CE] shadow-vela-subtle max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-vela-ink tracking-tight">
            Create Patient Account
          </h1>
          <p className="text-xs text-vela-muted mt-1">
            Access digital check-ins, medical records, and clinician messaging.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="firstName"
                className="text-[10px] font-bold uppercase text-vela-muted block mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                required
                id="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Maria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#DCD8CE] text-xs text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="text-[10px] font-bold uppercase text-vela-muted block mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                required
                id="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Santos"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#DCD8CE] text-xs text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-[10px] font-bold uppercase text-vela-muted block mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              required
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria.santos@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#DCD8CE] text-xs text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-[10px] font-bold uppercase text-vela-muted block mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (415) 555-0142"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#DCD8CE] text-xs text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-[10px] font-bold uppercase text-vela-muted block mb-1"
            >
              Create Password (at least 12 characters)
            </label>
            <input
              type="password"
              required
              minLength={12}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#DCD8CE] text-xs text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-card bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-vela-subtle transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Creating Account..." : "Register Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#DCD8CE] text-center text-xs text-vela-muted">
          <span>Already registered? </span>
          <Link
            href="/login"
            className="font-bold text-vela-sage hover:text-vela-sageDark"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
