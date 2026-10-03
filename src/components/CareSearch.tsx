"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
export default function CareSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  return (
    <form
      className="care-search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/doctors?q=${encodeURIComponent(query.trim())}`);
      }}
    >
      <Search size={20} aria-hidden="true" />
      <label className="sr-only" htmlFor="care-query">
        Search doctors, specialties or clinics
      </label>
      <input
        id="care-query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Physician, specialty, or clinic"
      />
      <button className="btn btn-primary" type="submit">
        Find care <ArrowRight size={16} />
      </button>
    </form>
  );
}
