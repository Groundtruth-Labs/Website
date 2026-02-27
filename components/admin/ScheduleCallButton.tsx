"use client";

import { useState } from "react";
import { Copy, X, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleCallButtonProps {
  contactName: string;
  contactEmail: string;
  bestTime?: string | null;
  company?: string | null;
}

const bestTimeHint: Record<string, string> = {
  morning: "morning (8am–12pm)",
  afternoon: "afternoon (12pm–5pm)",
  flexible: "any time that works for you",
};

export function ScheduleCallButton({
  contactName,
  contactEmail,
  bestTime,
  company,
}: ScheduleCallButtonProps) {
  const [open, setOpen] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const firstName = contactName.split(" ")[0];
  const timeHint = bestTime ? bestTimeHint[bestTime] ?? bestTime : "a time that works for you";
  const companyLine = company ? ` at ${company}` : "";

  const subject = `Discovery call: Groundtruth Labs`;

  const body = `Hi ${firstName},

Thanks for reaching out. We'd love to set up a short discovery call to learn more about your operation${companyLine} and walk you through what we can do.

The call is about 20–30 minutes over Zoom. Based on your preference, we have a few slots available in the ${timeHint}. Here are some options, let us know what works:

- [Option 1: e.g. Tuesday, March 4 at 10am HST]
- [Option 2: e.g. Wednesday, March 5 at 2pm HST]
- [Option 3: e.g. Thursday, March 6 at 11am HST]

Zoom link: [YOUR ZOOM LINK]

If none of these work, just reply with a time that's better and we'll make it work.

Looking forward to it.

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 rounded text-xs font-sans text-white hover:bg-cyan-800 transition-colors"
      >
        <Video className="w-3 h-3" />
        Schedule call
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-200 shadow-lg w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-mono font-semibold text-slate-900">
                  Schedule call with {firstName}
                </h2>
                <p className="font-sans text-xs text-slate-400 mt-0.5">
                  {contactEmail}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
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
                <p className="font-sans text-xs text-slate-400 mt-1.5">
                  Fill in the bracketed placeholders before sending.
                </p>
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
      )}
    </>
  );
}
