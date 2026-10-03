"use client";
import { useState, useEffect, useRef } from "react";
import type { PatientDocument } from "@/types";
import { PageHeading, EmptyState } from "@/components/CareUI";
export default function Documents() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [selected, setSelected] = useState<PatientDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    fetch("/api/documents")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setDocuments(d.documents);
      })
      .catch(() =>
        setError("Documents could not be loaded. Please reload to retry."),
      )
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);
  return (
    <>
      <PageHeading
        eyebrow="DOCUMENT CENTER"
        title="Your care, in writing."
        description="Visit summaries, prescriptions, and instructions shared by your care team."
      />
      {error && (
        <p role="alert" className="notice notice-error">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading documents…</p>
      ) : documents.length ? (
        <div className="stack">
          {documents.map((d) => (
            <button
              className="panel text-left flex items-center justify-between gap-6"
              key={d.id}
              onClick={() => setSelected(d)}
            >
              <div>
                <span className="eyebrow">
                  {d.docType.replaceAll("_", " ")}
                </span>
                <h2 className="text-xl mt-3">{d.title}</h2>
                <p className="text-sm text-vela-muted mt-2">
                  {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span>View →</span>
            </button>
          ))}
        </div>
      ) : (
        !error && (
          <EmptyState
            title="No documents shared yet"
            description="Your physician’s published visit summaries will appear here after your consultation."
          />
        )
      )}
      <dialog
        ref={dialog}
        className="document-dialog"
        aria-labelledby="document-title"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <div className="flex justify-between gap-5 pb-5 border-b border-vela-border">
              <h2 id="document-title" className="text-xl">
                {selected.title}
              </h2>
              <button
                autoFocus
                aria-label="Close document"
                onClick={() => dialog.current?.close()}
              >
                ✕
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed py-6">
              {selected.filePathOrSummary}
            </pre>
            <div className="flex gap-4 flex-wrap border-t border-vela-border pt-5">
              <a
                className="btn btn-primary"
                href={`/api/documents/${encodeURIComponent(selected.id)}`}
                download
              >
                Download text
              </a>
              <button
                className="btn btn-secondary"
                onClick={() => window.print()}
              >
                Print / save as PDF
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
