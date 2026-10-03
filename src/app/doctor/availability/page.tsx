"use client";
import { useState, useEffect } from "react";
import { PageHeading } from "@/components/CareUI";
const names = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
type Block = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_telehealth: number;
};
export default function Availability() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [inPerson, setInPerson] = useState(false);
  const [tele, setTele] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    Promise.all([
      fetch("/api/availability?schedule=true").then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      }),
      fetch("/api/profile").then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      }),
    ])
      .then(([d, p]) => {
        setBlocks(
          d.blocks.map((b: Block) => ({
            day_of_week: b.day_of_week,
            start_time: b.start_time,
            end_time: b.end_time,
            slot_duration_minutes: b.slot_duration_minutes,
            is_telehealth: b.is_telehealth,
          })),
        );
        setInPerson(p.profile.inPersonAvailable);
        setTele(p.profile.telehealthAvailable);
      })
      .catch(() =>
        setError("Availability could not be loaded. Reload to retry."),
      )
      .finally(() => setLoading(false));
  }, []);
  function change(i: number, key: keyof Block, value: string | number) {
    setBlocks((previous) =>
      previous.map((b, n) => (n === i ? { ...b, [key]: value } : b)),
    );
  }
  return (
    <>
      <PageHeading
        eyebrow="Practice scheduling"
        title="Make room for your patients."
        description="Publish weekly appointment windows. Each visit format keeps its own hours and slot duration. All times are Pacific Time."
      />
      {error && (
        <p role="alert" className="error-state mb-6">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="notice mb-6">
          {message}
        </p>
      )}
      {loading ? (
        <p role="status">Loading schedule…</p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            setMessage("");
            try {
              const r = await fetch("/api/availability", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  blocks,
                  inPersonEnabled: inPerson,
                  telehealthEnabled: tele,
                }),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              setMessage(
                "Availability saved. New booking options now use these hours.",
              );
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Could not save availability.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <fieldset className="flex gap-6 flex-wrap mb-8">
            <legend className="font-semibold mb-4">
              Accept appointments for
            </legend>
            <label className="flex gap-3 items-center">
              <input
                type="checkbox"
                checked={inPerson}
                onChange={(e) => setInPerson(e.target.checked)}
              />
              In-person visits
            </label>
            <label className="flex gap-3 items-center">
              <input
                type="checkbox"
                checked={tele}
                onChange={(e) => setTele(e.target.checked)}
              />
              Virtual visits
            </label>
          </fieldset>
          {[1, 2, 3, 4, 5, 6, 0].map((day) => (
            <section key={day} className="border-t border-vela-border py-6">
              <div className="flex justify-between gap-5 items-center mb-5">
                <h2 className="text-xl font-semibold">{names[day]}</h2>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setBlocks((previous) => [
                      ...previous,
                      {
                        day_of_week: day,
                        start_time: "09:00",
                        end_time: "12:00",
                        slot_duration_minutes: 30,
                        is_telehealth: 0,
                      },
                    ])
                  }
                >
                  Add time window
                </button>
              </div>
              {!blocks.some((b) => b.day_of_week === day) && (
                <p className="text-vela-muted">No published hours</p>
              )}
              <div className="space-y-4">
                {blocks.map((b, i) =>
                  b.day_of_week !== day ? null : (
                    <div
                      key={i}
                      className="grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-end"
                    >
                      <label className="field">
                        Visit format
                        <select
                          value={b.is_telehealth}
                          onChange={(e) =>
                            change(i, "is_telehealth", Number(e.target.value))
                          }
                        >
                          <option value={0}>In person</option>
                          <option value={1}>Virtual</option>
                        </select>
                      </label>
                      <label className="field">
                        Start
                        <input
                          type="time"
                          required
                          value={b.start_time}
                          onChange={(e) =>
                            change(i, "start_time", e.target.value)
                          }
                        />
                      </label>
                      <label className="field">
                        End
                        <input
                          type="time"
                          required
                          value={b.end_time}
                          onChange={(e) =>
                            change(i, "end_time", e.target.value)
                          }
                        />
                      </label>
                      <label className="field">
                        Visit length
                        <select
                          value={b.slot_duration_minutes}
                          onChange={(e) =>
                            change(
                              i,
                              "slot_duration_minutes",
                              Number(e.target.value),
                            )
                          }
                        >
                          {[20, 30, 45, 60].map((n) => (
                            <option value={n} key={n}>
                              {n} minutes
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        aria-label={`Remove ${names[day]} ${b.start_time} ${b.is_telehealth ? "virtual" : "in-person"} window`}
                        onClick={() =>
                          setBlocks((previous) =>
                            previous.filter((_, n) => n !== i),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ),
                )}
              </div>
            </section>
          ))}
          <p className="text-vela-muted text-sm mt-5">
            Existing bookings remain reserved even if you change your working
            hours. Disabled visit formats retain their time windows for later
            use.
          </p>
          <button
            className="btn btn-primary mt-6"
            disabled={busy || (!!error && loading)}
          >
            {busy ? "Saving…" : "Save availability"}
          </button>
        </form>
      )}
    </>
  );
}
