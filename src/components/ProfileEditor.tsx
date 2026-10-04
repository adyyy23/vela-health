"use client";
import { useEffect, useState } from "react";
import { PageHeading } from "./CareUI";
export default function ProfileEditor({
  doctor = false,
}: {
  doctor?: boolean;
}) {
  const [data, setData] = useState<any>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch("/api/profile")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setData(d);
        setForm(
          doctor
            ? {
                bio: d.profile.bio,
                consultationFee: String(d.profile.consultationFee),
              }
            : {
                firstName: d.user.firstName,
                lastName: d.user.lastName,
                phone: d.user.phone || "",
                emergency_contact_name: d.profile?.emergency_contact_name || "",
                emergency_contact_phone:
                  d.profile?.emergency_contact_phone || "",
                address: d.profile?.address || "",
              },
        );
      })
      .catch(() =>
        setError("Your profile could not be loaded. Please reload to retry."),
      );
  }, [doctor]);
  const fields = doctor
    ? [
        ["bio", "Clinical biography"],
        ["consultationFee", "Consultation fee ($)"],
      ]
    : [
        ["firstName", "First name"],
        ["lastName", "Last name"],
        ["phone", "Phone"],
        ["address", "Address"],
        ["emergency_contact_name", "Emergency contact name"],
        ["emergency_contact_phone", "Emergency contact phone"],
      ];
  return (
    <>
      <PageHeading
        eyebrow={doctor ? "PHYSICIAN PROFILE" : "YOUR ACCOUNT"}
        title={
          doctor ? "Your professional profile." : "Your details, up to date."
        }
        description={
          doctor
            ? "Keep your public biography and consultation fee current."
            : "Update contact information and the person we can reach in an emergency."
        }
      />
      {error && (
        <p role="alert" className="notice notice-error mb-6">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="notice mb-6">
          {message}
        </p>
      )}
      {!data && !error && <p role="status">Loading your profile…</p>}
      {data && (
        <form
          className="panel max-w-4xl"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            setMessage("");
            try {
              const r = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              setMessage("Your profile has been saved.");
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Could not save profile.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="mb-8 pb-6 border-b border-vela-border">
            <h2 className="text-2xl">
              {doctor ? "Dr. " : ""}
              {data.user.firstName} {data.user.lastName}
            </h2>
            <p className="text-vela-muted mt-2">{data.user.email}</p>
            {doctor && (
              <p className="text-sm text-vela-muted mt-2">
                {data.profile.specialtyName} · License{" "}
                {data.profile.licenseNumber}
              </p>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {fields.map(([key, label]) => (
              <div key={key} className={key === "bio" ? "sm:col-span-2" : ""}>
                <label className="field-label" htmlFor={key}>
                  {label}
                </label>
                {key === "bio" ? (
                  <textarea
                    id={key}
                    className="field"
                    rows={6}
                    required
                    value={form[key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    className="field"
                    id={key}
                    type={
                      key === "consultationFee"
                        ? "number"
                        : key.includes("phone") || key === "phone"
                          ? "tel"
                          : "text"
                    }
                    min={key === "consultationFee" ? 0 : undefined}
                    max={key === "consultationFee" ? 10000 : undefined}
                    required={[
                      "firstName",
                      "lastName",
                      "consultationFee",
                    ].includes(key)}
                    value={form[key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary mt-8"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </>
  );
}
