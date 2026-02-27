"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type State = "idle" | "loading" | "error" | "success";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${origin}/auth/callback?next=/update-password`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setState("error");
    } else {
      setState("success");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-cyan-50 border border-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-cyan-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="font-mono text-xl font-semibold text-slate-900 mb-2">
          Check your email
        </h2>
        <p className="font-sans text-sm text-slate-600 mb-6">
          We sent a password reset link to{" "}
          <span className="font-semibold text-slate-800">{email}</span>.
        </p>
        <Link href="/login" className="font-sans text-xs text-cyan-700 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Image
          src="/favicon.png"
          alt="Groundtruth Labs logo"
          width={32}
          height={32}
          className="rounded flex-shrink-0"
        />
        <span className="font-mono font-semibold text-slate-900 text-sm">
          Groundtruth Labs
        </span>
      </div>

      <h1 className="font-mono text-2xl font-bold text-slate-900 mb-1">
        Reset password
      </h1>
      <p className="font-sans text-sm text-slate-600 mb-8">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            disabled={state === "loading"}
          />
        </div>

        {state === "error" && (
          <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={state === "loading" || !email}
        >
          {state === "loading" ? (
            "Sending link…"
          ) : (
            <>
              Send reset link
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="font-sans text-xs text-slate-400 mt-6 text-center">
        Remembered it?{" "}
        <Link href="/login" className="text-cyan-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
