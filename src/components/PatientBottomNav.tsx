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
      <div className="pointer-events-auto bg-white/92 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.04)] rounded-full px-3 py-2 flex items-center gap-1 sm:gap-3 max-w-md w-full justify-between">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 sm:px-4 rounded-full transition-all duration-200 group ${
                isActive
                  ? "text-sky-600 font-semibold"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {/* Active subtle background pill */}
              {isActive && (
                <div className="absolute inset-0 bg-sky-50 rounded-full -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? "font-bold text-slate-900" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
