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
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block">
              Direct Clinical Channel
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinician Messages
            </h1>
          </div>

          <div className="space-y-2">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className="w-full p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3 text-left hover:border-sky-300 transition"
              >
                <img
                  src={c.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
                  alt={c.doctorName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{c.doctorName}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="text-[11px] text-sky-600 font-semibold block">{c.doctorSpecialty}</span>
                  <p className="text-xs text-slate-500 truncate mt-1">{c.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ACTIVE CONVERSATION THREAD */
        <div className="flex flex-col h-full bg-[#EDF3F8]">
          {/* Thread Header with Appointment Context Pill */}
          <div className="p-3 sm:px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConvId(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <img
                src={activeConv?.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"}
                alt="Doctor"
                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    {activeConv?.doctorName}
                  </h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <span className="text-[10px] text-sky-600 font-semibold">
                  {activeConv?.doctorSpecialty} • Active Care Plan
                </span>
              </div>
            </div>

            {/* Appointment Context Pill */}
            <div className="mt-2 py-1 px-3 bg-sky-50/80 border border-sky-100 rounded-full flex items-center justify-between text-[10px] text-sky-900">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-sky-600" />
                <span>Regarding: Today 10:30 AM Visit</span>
              </div>
              <span className="font-bold text-sky-700">Checked In</span>
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
                    className={`max-w-[82%] px-4 py-3 rounded-3xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-sky-600 text-white rounded-br-sm"
                        : "bg-white text-slate-900 border border-slate-200/80 rounded-bl-sm"
                    }`}
                  >
                    <p>{m.content}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
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
            className="p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message to Dr. Reyes..."
              className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-sm disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
