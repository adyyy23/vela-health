"use client";

import React, { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/types";
import { Send, CheckCircle2, Calendar, MessageSquare, Clock } from "lucide-react";

export default function DoctorMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        if (data.conversations) {
          setConversations(data.conversations);
          if (data.conversations.length > 0) {
            setActiveConvId(data.conversations[0].id);
          }
        }
      });
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    fetch(`/api/messages?conversationId=${activeConvId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      });
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConvId) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConvId, content: replyText }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setReplyText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-vela-ink">
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E2E8E4] shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-vela-sage block mb-1">
          Clinical Communications
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-vela-ink tracking-tight">
          Patient Inquiries & Messages
        </h1>
        <p className="text-xs text-vela-muted mt-1">
          Appointment-linked discussions and post-consultation follow-up with Dr. Reyes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] items-stretch">
        {/* Thread List (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-card border border-[#E2E8E4] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8E4] bg-vela-surfaceSubtle">
            <span className="text-xs font-bold text-vela-ink">Conversations</span>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {conversations.map((c) => {
              const isActive = c.id === activeConvId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full p-3 rounded-button text-left transition flex items-start gap-3 ${
                    isActive ? "bg-[#EAF0EC] border border-vela-sage/30" : "hover:bg-vela-surfaceSubtle"
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt={c.patientName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#E2E8E4]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-vela-ink truncate">{c.patientName}</h4>
                      <span className="text-[10px] text-vela-muted">10:24 AM</span>
                    </div>
                    <p className="text-xs text-vela-muted truncate">{c.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Conversation Chat (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-card border border-[#E2E8E4] shadow-sm flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#E2E8E4] flex items-center justify-between bg-vela-surfaceSubtle">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt={activeConv.patientName}
                    className="w-9 h-9 rounded-xl object-cover border border-[#E2E8E4]"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-vela-ink">{activeConv.patientName}</h3>
                    <span className="text-[10px] text-vela-sage font-semibold block">
                      Active Encounter • Checked In
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-vela-muted bg-white px-2.5 py-1 rounded-pill border border-[#E2E8E4]">
                  Ref: VELA-89421
                </span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-vela-canvas">
                {messages.map((m) => {
                  const isDoctor = m.senderRole === "DOCTOR";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isDoctor ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-card text-xs leading-relaxed ${
                          isDoctor
                            ? "bg-vela-forest text-white rounded-br-sm"
                            : "bg-white text-vela-ink border border-[#E2E8E4] rounded-bl-sm shadow-sm"
                        }`}
                      >
                        <p>{m.content}</p>
                      </div>
                      <span className="text-[9px] text-vela-muted mt-1 px-1">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Composer */}
              <form
                onSubmit={handleSendReply}
                className="p-3 border-t border-[#E2E8E4] bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Send clinical message or prescription instructions..."
                  className="flex-1 px-4 py-2.5 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="px-5 py-2.5 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-vela-muted">
              Select a conversation to reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
