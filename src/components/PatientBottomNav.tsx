"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CalendarCheck,
  MessageSquare,
  User,
  LayoutGrid,
} from "lucide-react";

export default function PatientBottomNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(1);

  const tabs = [
    {
      id: "home",
      label: "Home",
      href: "/patient",
      icon: LayoutGrid,
      exact: true,
    },
    {
      id: "explore",
      label: "Explore",
      href: "/patient/explore",
      icon: Compass,
      exact: false,
    },
    {
      id: "appointments",
      label: "Care",
      href: "/patient/appointments",
      icon: CalendarCheck,
      exact: false,
    },
    {
      id: "messages",
      label: "Messages",
      href: "/patient/messages",
      icon: MessageSquare,
      exact: false,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/patient/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Patient Navigation"
      className="fixed bottom-3 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#E2E8E4] shadow-[0_8px_28px_rgba(20,34,28,0.08)] rounded-full px-2 py-1.5 flex items-center gap-1 sm:gap-2 max-w-md w-full justify-between">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 sm:px-4 rounded-full transition-all duration-200 group ${
                isActive
                  ? "text-vela-forest font-bold"
                  : "text-vela-muted hover:text-vela-ink"
              }`}
            >
              {/* Active subtle background pill */}
              {isActive && (
                <div className="absolute inset-0 bg-[#EAF0EC] rounded-full -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? "scale-105 stroke-[2.2] text-vela-forest" : "stroke-[1.8] text-vela-muted group-hover:text-vela-ink"
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? "font-bold text-vela-forest" : "font-medium text-vela-muted"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
