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
  const [copied, setCopied] = useState(false);

  const loginLink = `${typeof window !== "undefined" ? window.location.origin : ""}/login?email=${encodeURIComponent(clientEmail)}`;
  const signupLink = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?email=${encodeURIComponent(clientEmail)}`;

  const message = `Client Email: ${clientEmail}

Login (if account exists):
${loginLink}

Sign Up (if new account):
${signupLink}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded border border-slate-200 shadow-lg w-full max-w-md">
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
          <p className="font-sans text-sm text-slate-600">
            Copy and send this to your client:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded p-4 font-mono text-xs overflow-auto max-h-64">
            <pre className="whitespace-pre-wrap break-words text-slate-700">
              {message}
            </pre>
          </div>

          <Button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy to clipboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
