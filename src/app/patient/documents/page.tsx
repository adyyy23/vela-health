"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PatientDocument } from "@/types";
import { FileText, Download, ShieldCheck, Calendar, ChevronRight, X } from "lucide-react";

export default function PatientDocumentsPage() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<PatientDocument | null>(null);

  useEffect(() => {
    // In our seed, patient usr-patient-1 has 2 documents
    setDocuments([
      {
        id: "doc-1",
        patientId: "usr-patient-1",
        title: "Dermatology Visit Summary & Care Plan",
        docType: "VISIT_SUMMARY",
        filePathOrSummary:
          "CLINICAL VISIT SUMMARY\n\nAttending: Dr. Elena Reyes, MD (CA-MD-892147)\nDate of Encounter: October 2026\nFacility: Vela Central Pavilion, Suite 800\n\nSUBJECTIVE:\nPatient presents with pruritic localized erythema on the left volar forearm for 10 days.\n\nOBJECTIVE:\nCutaneous exam reveals mild localized eczematous plaque with subtle micro-vesiculation. Dermoscopic evaluation confirms benign contact dermatitis.\n\nASSESSMENT & PLAN:\n1. Contact dermatitis, unspecified etiology.\n2. Prescribed Desonide 0.05% ointment. Apply BID x14d.\n3. Patient educated on barrier restoration using fragrance-free ceramide emollients.\n4. Follow-up in 2-4 weeks as needed.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "doc-2",
        patientId: "usr-patient-1",
        title: "Official e-Prescription — Desonide 0.05% Ointment",
        docType: "PRESCRIPTION",
        filePathOrSummary:
          "ELECTRONIC PRESCRIPTION ORDER\n\nRx ID: #991048-CA\nPatient: Maria Clara Santos (DOB: 1995-04-18)\nPrescriber: Dr. Elena Reyes, MD\nDEA / NPI: 8921471029\n\nMEDICATION:\nDesonide 0.05% Topical Ointment (15g)\nSig: Apply thin film to affected forearm areas twice daily for 14 days\nRefills Authorized: 1\nDispensed To: Walgreens Pharmacy #0214, SF CA",
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 text-vela-ink">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-vela-sage block">
          Medical Records
        </span>
        <h1 className="text-2xl font-extrabold text-vela-ink tracking-tight">
          Patient Documents
        </h1>
        <p className="text-xs text-vela-muted mt-1">
          Secure, authenticated clinical summaries, prescriptions, and lab orders.
        </p>
      </div>

      <div className="space-y-2.5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="p-4 rounded-card bg-white border border-[#E2E8E4] shadow-sm hover:border-vela-sage/40 transition cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-vela-surfaceSubtle text-vela-sage flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-vela-ink group-hover:text-vela-forest transition">
                  {doc.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-vela-muted">
                  <span className="font-semibold text-vela-sage">
                    {doc.docType.replace("_", " ")}
                  </span>
                  <span>•</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-vela-muted/40 group-hover:text-vela-ink transition" />
          </div>
        ))}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-surface p-6 max-w-lg w-full max-h-[85vh] flex flex-col shadow-xl border border-[#E2E8E4]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8E4]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-vela-sage" />
                <h3 className="font-bold text-sm text-vela-ink">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-full text-vela-muted hover:text-vela-ink hover:bg-vela-surfaceSubtle transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 p-4 rounded-card bg-vela-surfaceSubtle border border-[#E2E8E4] font-mono text-xs text-vela-ink whitespace-pre-wrap leading-relaxed">
              {selectedDoc.filePathOrSummary}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E4]">
              <span className="text-[11px] text-vela-muted">Digitally signed & encrypted</span>
              <button
                onClick={() => alert("Downloading secure document PDF...")}
                className="px-4 py-2 rounded-button bg-vela-sage hover:bg-vela-sageDark text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
