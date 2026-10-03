"use client";

import React, { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/types";
import {
  MessageSquare,
  Send,
  Calendar,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function PatientMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConvId, content: newMessage }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-76px)]">
      {/* If no active conversation selected (or mobile inbox toggle) */}
      {!activeConvId ? (
        <div className="p-4 sm:p-5 flex flex-col gap-4 text-vela-ink">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage block">
              Direct Clinical Channel
            </span>
            <h1 className="text-2xl font-extrabold text-vela-ink tracking-tight">
              Clinician Messages
            </h1>
          </div>

          <div className="space-y-2.5">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className="w-full p-4 rounded-card bg-white border border-[#E2E8E4] shadow-sm flex items-start gap-3 text-left hover:border-vela-sage/40 transition"
              >
                <img
                  src={c.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
                  alt={c.doctorName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E2E8E4] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-xs text-vela-ink truncate">{c.doctorName}</h4>
                    <span className="text-[10px] text-vela-muted">
                      {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="text-[11px] text-vela-sage font-semibold block">{c.doctorSpecialty}</span>
                  <p className="text-xs text-vela-muted truncate mt-1">{c.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ACTIVE CONVERSATION THREAD */
        <div className="flex flex-col h-full bg-vela-canvas">
          {/* Thread Header with Appointment Context Pill */}
          <div className="p-3 sm:px-4 bg-white/95 backdrop-blur-md border-b border-[#E2E8E4] shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConvId(null)}
                className="p-1 rounded-xl text-vela-muted hover:text-vela-ink transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <img
                src={activeConv?.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
                alt="Doctor"
                className="w-9 h-9 rounded-xl object-cover border border-[#E2E8E4]"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-vela-ink truncate">
                    {activeConv?.doctorName}
                  </h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-vela-sage" />
                </div>
                <span className="text-[10px] text-vela-sage font-semibold">
                  {activeConv?.doctorSpecialty} • Active Care Plan
                </span>
              </div>
            </div>

            {/* Appointment Context Pill */}
            <div className="mt-2 py-1 px-3 bg-[#EAF0EC] border border-vela-sage/20 rounded-pill flex items-center justify-between text-[10px] text-vela-forest">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-vela-sage" />
                <span>Regarding: Today 10:30 AM Visit</span>
              </div>
              <span className="font-bold text-vela-forest">Checked In</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => {
              const isMe = m.senderRole === "PATIENT";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-card text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-vela-forest text-white rounded-br-sm"
                        : "bg-white text-vela-ink border border-[#E2E8E4] rounded-bl-sm"
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

          {/* Message Composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white/95 backdrop-blur-md border-t border-[#E2E8E4] flex items-center gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message to your clinician..."
              className="flex-1 px-4 py-2.5 rounded-button bg-vela-surfaceSubtle border border-[#E2E8E4] text-xs font-medium text-vela-ink focus:outline-none focus:ring-2 focus:ring-vela-sage"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="w-9 h-9 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white flex items-center justify-center shadow-sm disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
