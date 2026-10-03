"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import type { Notification } from "@/types";
export default function NotificationCenter() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const load = () =>
    fetch("/api/notifications")
      .then((r) => {
        if (!r.ok) throw Error("Notifications could not be loaded.");
        return r.json();
      })
      .then((d) => setItems(d.notifications))
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  const unread = items.filter((n) => !n.isRead).length;
  return (
    <div className="relative">
      <button
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className="p-2 relative"
        onClick={() => {
          setOpen(!open);
          load();
        }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-0 right-0 text-[10px] bg-vela-forest text-white rounded-full px-1">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <section
          className="fixed sm:absolute right-4 sm:right-0 top-24 sm:top-12 w-[calc(100%_-_32px)] sm:w-96 bg-white border border-vela-border shadow-vela-floating z-50 max-h-[65vh] overflow-y-auto"
          aria-label="Notification center"
        >
          <div className="p-4 flex justify-between border-b border-vela-border">
            <h2 className="font-semibold">Notifications</h2>
            <button
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          {error && (
            <p role="alert" className="notice notice-error">
              {error}
            </p>
          )}
          {!items.length && !error && (
            <p className="p-6 text-vela-muted">You’re all caught up.</p>
          )}
          {items.map((n) => (
            <div key={n.id} className="p-4 border-b border-vela-border text-sm">
              <p className="font-semibold">{n.title}</p>
              <p className="text-vela-muted mt-1">{n.message}</p>
              <div className="mt-3 flex justify-between">
                {n.link && (
                  <Link
                    href={n.link}
                    onClick={() => setOpen(false)}
                    className="underline"
                  >
                    View details
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={async () => {
                      const r = await fetch("/api/notifications", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: n.id }),
                      });
                      if (r.ok)
                        setItems(
                          items.map((x) =>
                            x.id === n.id ? { ...x, isRead: true } : x,
                          ),
                        );
                      else setError("Could not mark notification as read.");
                    }}
                    className="underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
