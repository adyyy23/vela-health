"use client";
import { useState } from "react";
export default function ProviderPortrait({
  src,
  name,
  className = "",
  priority = false,
}: {
  src?: string;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    <div className={`provider-portrait ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="portrait-fallback"
          role="img"
          aria-label={`${name}, profile portrait unavailable`}
        >
          <span aria-hidden="true">{initials}</span>
        </div>
      )}
    </div>
  );
}
