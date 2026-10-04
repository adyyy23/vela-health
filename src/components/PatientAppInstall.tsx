"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Smartphone } from "lucide-react";
interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}
export default function PatientAppInstall() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const complete = () => {
      setInstalled(true);
      setPrompt(null);
    };
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", complete);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", complete);
    };
  }, []);
  return (
    <section className="patient-app-intro">
      <Smartphone size={40} strokeWidth={1.3} aria-hidden="true" />
      <p className="eyebrow mt-6">VELA FOR PATIENTS</p>
      <h1 className="text-4xl sm:text-5xl tracking-tight mt-3">
        Your care, on your phone.
      </h1>
      <p className="text-vela-muted text-lg mt-5">
        Manage appointments, message your care team, and access your visit
        documents in the VELA patient app.
      </p>
      <p className="mt-4 text-sm text-vela-muted">
        Open this website on your phone to sign in or add VELA to your home
        screen. This is a web app; no App Store download is required. An
        internet connection is required for your care records.
      </p>
      <div className="flex gap-3 flex-wrap mt-7">
        {prompt && !installed && (
          <button
            className="btn btn-primary"
            onClick={async () => {
              try {
                await prompt.prompt();
                await prompt.userChoice;
                setPrompt(null);
              } catch {
                setError(
                  "Installation could not open. Use your browser’s Add to Home Screen option below.",
                );
              }
            }}
          >
            <Download size={18} aria-hidden="true" />
            Install patient app
          </button>
        )}
        <Link
          href="/login?returnTo=/patient"
          className="btn btn-primary patient-phone-link"
        >
          {installed ? "Open patient app" : "Patient sign in"}
        </Link>
        <Link href="/" className="btn btn-secondary">
          Explore VELA
        </Link>
      </div>
      {installed && (
        <p role="status" className="mt-4">
          VELA is open as an installed app.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4">
          {error}
        </p>
      )}
      <div className="mt-10 border-t border-vela-border pt-6 space-y-5">
        <div>
          <h2 className="font-semibold">iPhone</h2>
          <p className="text-vela-muted mt-2">
            Open VELA in Safari, tap Share, then Add to Home Screen.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Android</h2>
          <p className="text-vela-muted mt-2">
            Open VELA in Chrome. Tap Install patient app when available, or use
            the browser menu’s Install app / Add to Home Screen option.
          </p>
        </div>
        <div className="patient-desktop-note">
          <h2 className="font-semibold">Viewing on a computer?</h2>
          <p className="text-vela-muted mt-2">
            Open this same website address on your phone. Patient accounts are
            designed for mobile screens. Doctors and administrators can use the{" "}
            <Link href="/login" className="underline">
              staff sign in
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
