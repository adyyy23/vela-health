import React from "react";

interface VelaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  hideWordmark?: boolean;
}

export default function VelaLogo({
  className = "",
  size = "md",
  inverted = false,
  hideWordmark = false,
}: VelaLogoProps) {
  // Dimensions based on size
  const iconBox = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-9 h-9" : "w-7 h-7";
  const titleSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  const subSize = size === "sm" ? "text-[9px]" : size === "lg" ? "text-[11px]" : "text-[10px]";

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* VELA Abstract Brand Mark: Geometric V + Vitality Pulse Convergence */}
      <div
        className={`relative flex items-center justify-center rounded-[8px] shrink-0 transition-transform ${
          inverted ? "bg-white text-vela-forest" : "bg-vela-forest text-white"
        } ${iconBox}`}
      >
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Abstract V left arm: Clean descending stem */}
          <path
            d="M6 7.5L12.8 21.2C13.2 22 14.2 22.3 15 21.8C15.3 21.6 15.5 21.4 15.6 21.1L18.8 14.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pulse beacon accent ascending right arm */}
          <path
            d="M17.2 12.5L20.8 6.5C21.2 5.8 22.1 5.6 22.8 6C23.1 6.2 23.4 6.5 23.5 6.9L24.5 10"
            stroke={inverted ? "#526A5B" : "#8BA192"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central guidance / anchor focal dot */}
          <circle
            cx="14"
            cy="11"
            r="1.75"
            fill={inverted ? "#526A5B" : "#A3B7AA"}
          />
        </svg>
      </div>

      {!hideWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${titleSize} ${
                inverted ? "text-white" : "text-vela-ink"
              }`}
            >
              VELA
            </span>
            <span
              className={`font-bold tracking-widest uppercase ${subSize} ${
                inverted ? "text-emerald-200" : "text-vela-sage"
              }`}
            >
              Health
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
