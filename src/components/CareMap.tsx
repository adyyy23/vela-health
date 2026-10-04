"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Clinic } from "@/types";

interface CareMapProps {
  clinics: Clinic[];
  selectedClinicId?: string | null;
  onSelectClinic?: (clinic: Clinic) => void;
  className?: string;
  zoom?: number;
  center?: [number, number];
}

export default function CareMap({
  clinics,
  selectedClinicId,
  onSelectClinic,
  className = "w-full h-full",
  zoom = 13,
  center = [37.785, -122.415], // Default SF
}: CareMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Carto Positron provides the clean, light, icy map aesthetic matching the reference image!
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        },
      ).addTo(map);

      // Add a clean top-right subtle zoom control
      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when clinics or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    clinics.forEach((clinic) => {
      const isSelected = clinic.id === selectedClinicId;

      const iconHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? "scale-110 z-50" : "scale-100"}">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            isSelected
              ? "bg-[#32151E] text-white ring-2 ring-[#993F2E]/40"
              : "bg-white text-[#32151E] shadow-none border border-[#DCD8CE] hover:bg-white"
          }">
            <div class="w-2.5 h-2.5 rounded-full ${isSelected ? "bg-white" : "bg-[#993F2E]"}"></div>
            <span class="text-xs font-semibold whitespace-nowrap">${clinic.name.replace("Vela ", "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)}</span>
          </div>
          <div class="w-2 h-2 ${isSelected ? "bg-[#32151E]" : "bg-white"} rotate-45 mx-auto -mt-1 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-map-pin",
        html: iconHtml,
        iconSize: [120, 36],
        iconAnchor: [60, 36],
      });

      const marker = L.marker([clinic.latitude, clinic.longitude], {
        icon: customIcon,
      }).addTo(map);

      marker.on("click", () => {
        if (onSelectClinic) {
          onSelectClinic(clinic);
        }
        map.panTo([clinic.latitude, clinic.longitude], {
          animate: true,
          duration: 0.5,
        });
      });

      markersRef.current[clinic.id] = marker;
    });

    // If selected clinic changed, pan to it
    if (selectedClinicId) {
      const selected = clinics.find((c) => c.id === selectedClinicId);
      if (selected) {
        map.panTo([selected.latitude, selected.longitude], {
          animate: true,
          duration: 0.6,
        });
      }
    }
  }, [clinics, selectedClinicId, onSelectClinic]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {/* Subtle attribution watermark */}
      <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full pointer-events-none z-10">
        © OpenStreetMap © CARTO
      </div>
    </div>
  );
}
