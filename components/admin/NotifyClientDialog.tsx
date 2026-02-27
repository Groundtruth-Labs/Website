"use client";

import { useState } from "react";
import { Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotifyClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientEmail: string;
  clientName: string;
}

export function NotifyClientDialog({
  open,
  onOpenChange,
  clientEmail,
  clientName,
}: NotifyClientDialogProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const signupLink = `${origin}/signup?email=${encodeURIComponent(clientEmail)}`;
  const loginLink = `${origin}/login?email=${encodeURIComponent(clientEmail)}`;

  const firstName = clientName.split(" ")[0];

  const subject = `Your Groundtruth Labs dashboard is ready`;

  const body = `Hi ${firstName},

Your client dashboard is set up and ready to go. You can access your project deliverables, NDVI maps, reports, and site progress all in one place.

To get started, create your account using the link below (it takes about 30 seconds):

${signupLink}

If you already have an account, sign in here:

${loginLink}

Let us know if you run into any issues or have questions.

Best,
Groundtruth Labs`;

  const copyText = async (text: string, type: "subject" | "body") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "subject") {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded border border-slate-200 shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-mono font-semibold text-slate-900">
            Notify {clientName}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Subject */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Subject
              </span>
              <button
                onClick={() => copyText(subject, "subject")}
                className="font-sans text-xs text-cyan-700 hover:underline"
              >
                {copiedSubject ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 font-sans text-sm text-slate-700">
              {subject}
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Body
              </span>
              <button
                onClick={() => copyText(body, "body")}
                className="font-sans text-xs text-cyan-700 hover:underline"
              >
                {copiedBody ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 font-sans text-sm text-slate-700 overflow-auto max-h-72">
              <pre className="whitespace-pre-wrap break-words leading-relaxed">
                {body}
              </pre>
            </div>
          </div>

          <Button
            onClick={() => copyText(`Subject: ${subject}\n\n${body}`, "body")}
            className="w-full flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copiedBody ? "Copied!" : "Copy everything"}
          </Button>
        </div>
      </div>
    </div>
  );
}
