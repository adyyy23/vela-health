"use client";

import React, { useState } from "react";
import { Sliders, Clock, Calendar, CheckCircle2, ShieldCheck, Plus, Trash2 } from "lucide-react";

export default function DoctorAvailabilityPage() {
  const [slotDuration, setSlotDuration] = useState("30");
  const [telehealthEnabled, setTelehealthEnabled] = useState(true);
  const [inPersonEnabled, setInPersonEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const [days, setDays] = useState([
    { name: "Monday", active: true, start: "08:30", end: "16:30" },
    { name: "Tuesday", active: true, start: "08:30", end: "16:30" },
    { name: "Wednesday", active: true, start: "09:00", end: "17:00" },
    { name: "Thursday", active: true, start: "08:30", end: "16:30" },
    { name: "Friday", active: true, start: "09:00", end: "15:00" },
    { name: "Saturday", active: false, start: "09:00", end: "13:00" },
    { name: "Sunday", active: false, start: "09:00", end: "13:00" },
  ]);

  const toggleDay = (idx: number) => {
    setDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, active: !d.active } : d))
    );
  };

  const updateTime = (idx: number, field: "start" | "end", val: string) => {
    setDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl text-vela-ink">
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
              Scheduling Parameters
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
              Manage Doctor Availability
            </h1>
            <p className="text-xs text-vela-muted mt-1">
              Configure working hours, appointment durations, and clinic assignments for Dr. Elena Reyes.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Schedule</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Availability schedule saved! Updated slot intervals are now active on the public discovery calendar.</span>
        </div>
      )}

      {/* Appointment Duration & Modalities */}
      <div className="bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm">
        <h3 className="text-sm font-bold text-vela-ink mb-4">Consultation Duration & Formats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-vela-muted block mb-1">
              Standard Slot Duration
            </label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] font-semibold text-vela-ink"
            >
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes (Recommended)</option>
              <option value="45">45 Minutes (Extended)</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          <div className="p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] flex items-center justify-between">
            <div>
              <span className="font-bold text-vela-ink block">In-Person Visits</span>
              <span className="text-[10px] text-vela-muted">Vela Central Pavilion</span>
            </div>
            <input
              type="checkbox"
              checked={inPersonEnabled}
              onChange={(e) => setInPersonEnabled(e.target.checked)}
              className="w-4 h-4 accent-vela-sage rounded cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] flex items-center justify-between">
            <div>
              <span className="font-bold text-vela-ink block">Virtual Telehealth</span>
              <span className="text-[10px] text-vela-muted">HD Video Platform</span>
            </div>
            <input
              type="checkbox"
              checked={telehealthEnabled}
              onChange={(e) => setTelehealthEnabled(e.target.checked)}
              className="w-4 h-4 accent-vela-sage rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Weekly Schedule Days */}
      <div className="bg-white rounded-card p-6 border border-[#E2E8E4] shadow-sm">
        <h3 className="text-sm font-bold text-vela-ink mb-4">Weekly Clinic Operating Hours</h3>
        <div className="space-y-3">
          {days.map((day, idx) => (
            <div
              key={day.name}
              className={`p-3.5 rounded-button border transition flex items-center justify-between gap-4 text-xs ${
                day.active ? "bg-white border-[#E2E8E4]" : "bg-vela-surfaceSubtle border-[#E2E8E4]/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 w-32">
                <input
                  type="checkbox"
                  checked={day.active}
                  onChange={() => toggleDay(idx)}
                  className="w-4 h-4 accent-vela-sage rounded cursor-pointer"
                />
                <span className="font-bold text-vela-ink">{day.name}</span>
              </div>

              {day.active ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.start}
                    onChange={(e) => updateTime(idx, "start", e.target.value)}
                    className="px-2.5 py-1.5 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-semibold text-vela-ink"
                  />
                  <span className="text-vela-muted">to</span>
                  <input
                    type="time"
                    value={day.end}
                    onChange={(e) => updateTime(idx, "end", e.target.value)}
                    className="px-2.5 py-1.5 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-semibold text-vela-ink"
                  />
                </div>
              ) : (
                <span className="text-vela-muted italic">Day Off / Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
