"use client";
import { useEffect, useState } from "react";
import { EmptyState, PageHeading } from "./CareUI";
import type { Conversation, Message } from "@/types";
export default function MessagesWorkspace({
  role,
}: {
  role: "PATIENT" | "DOCTOR";
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/messages", { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw Error("Unable to load conversations.");
        return r.json();
      })
      .then((d) => {
        setConversations(d.conversations || []);
        setActive(d.conversations?.[0]?.id || "");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    setMessages([]);
    setMessageLoading(true);
    const refresh = () =>
      fetch(`/api/messages?conversationId=${encodeURIComponent(active)}`, {
        signal: controller.signal,
      })
        .then(async (r) => {
          if (!r.ok) throw Error("Unable to load this conversation.");
          return r.json();
        })
        .then((d) => setMessages(d.messages || []))
        .catch((e) => {
          if (e.name !== "AbortError") setError(e.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setMessageLoading(false);
        });
    refresh();
    const timer = setInterval(refresh, 15000);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [active]);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: active, content: text }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "Message could not be sent.");
      setMessages((previous) => [...previous, d.message]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const selected = conversations.find((c) => c.id === active);
  return (
    <>
      <PageHeading
        eyebrow="Conversations"
        title={
          role === "PATIENT"
            ? "A direct line to your care team."
            : "Patient conversations."
        }
        description="Appointment-linked messages. For urgent concerns, call your clinic. Do not use messaging for emergencies."
      />
      {error && (
        <p role="alert" className="error-state mb-5">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading conversations…</p>
      ) : !conversations.length ? (
        <EmptyState
          title="No conversations yet"
          description="A conversation is created when a patient books an appointment."
        />
      ) : (
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          <nav
            aria-label="Conversations"
            className="border-t border-vela-border"
          >
            {conversations.map((c) => (
              <button
                className={`w-full text-left py-5 px-3 border-b border-vela-border ${active === c.id ? "bg-vela-surfaceSubtle" : ""}`}
                key={c.id}
                aria-pressed={active === c.id}
                onClick={() => {
                  setActive(c.id);
                  setError("");
                }}
              >
                <strong>
                  {role === "PATIENT" ? c.doctorName : c.patientName}
                </strong>
                <p className="text-vela-muted mt-1 text-sm line-clamp-2">
                  {c.lastMessage || "Your appointment conversation"}
                </p>
              </button>
            ))}
          </nav>
          <section className="panel p-6 min-w-0">
            <h2 className="text-xl font-semibold">
              {role === "PATIENT"
                ? selected?.doctorName
                : selected?.patientName}
            </h2>
            <div
              className="my-6 space-y-5 max-h-[450px] overflow-y-auto"
              aria-label="Message history"
              aria-live="polite"
            >
              {messageLoading ? (
                <p role="status">Loading messages…</p>
              ) : messages.length ? (
                messages.map((m) => (
                  <article
                    key={m.id}
                    className={`border-l-2 pl-4 py-1 ${m.senderRole === role ? "border-vela-sage" : "border-vela-border"}`}
                  >
                    <p className="text-sm font-semibold">
                      {m.senderName}{" "}
                      <time
                        className="font-normal text-vela-muted"
                        dateTime={m.createdAt}
                      >
                        {new Date(m.createdAt).toLocaleString()}
                      </time>
                    </p>
                    <p className="whitespace-pre-wrap break-words mt-2">
                      {m.content}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-vela-muted">
                  Start your appointment conversation.
                </p>
              )}
            </div>
            <form onSubmit={send}>
              <label className="field">
                Your message
                <textarea
                  rows={3}
                  maxLength={10000}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </label>
              <button
                className="btn btn-primary mt-4"
                disabled={busy || !text.trim()}
              >
                {busy ? "Sending…" : "Send message"}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
