import React from "react";
import Link from "next/navigation";

interface VelaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

export default function VelaLogo({
  className = "",
  size = "md",
  inverted = false,
}: VelaLogoProps) {
  const iconSize = size === "sm" ? 22 : size === "lg" ? 34 : 26;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Precision Geometric Medical Constellation Crest */}
      <div
        className={`relative flex items-center justify-center rounded-2xl ${
          inverted ? "bg-white text-sky-600" : "bg-sky-600 text-white"
        } shadow-sm transition-transform hover:scale-105`}
        style={{ width: iconSize + 10, height: iconSize + 10 }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          {/* Medical cross + guiding star intersection */}
          <path d="M12 4v16M4 12h16" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.25" stroke="none" />
          <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight ${textSize} ${inverted ? "text-white" : "text-slate-900"}`}>
          Vela<span className="text-sky-500 font-medium">.</span>
        </span>
        <span className={`text-[10px] uppercase font-semibold tracking-wider ${inverted ? "text-sky-200" : "text-slate-400"}`}>
          Health Care
        </span>
      </div>
    </div>
  );
}
