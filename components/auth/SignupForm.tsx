"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, resendVerificationEmail } from "@/app/auth/actions";

type State = "idle" | "loading" | "error" | "verify_email";
type ResendState = "idle" | "sending" | "sent" | "error";

export function SignupForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [resendState, setResendState] = useState<ResendState>("idle");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setState("error");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setState("error");
      return;
    }

    try {
      await registerUser({ email, password, company });
      setState("verify_email");
    } catch (signupError) {
      const message =
        signupError instanceof Error ? signupError.message : "Failed to create account";
      setError(message);
      setState("error");
    }
  }

  async function handleResend() {
    setResendState("sending");
    try {
      await resendVerificationEmail(email);
      setResendState("sent");
      setTimeout(() => setResendState("idle"), 4000);
    } catch (err) {
      console.error("Resend failed:", err instanceof Error ? err.message : String(err));
      setResendState("error");
      setTimeout(() => setResendState("idle"), 4000);
    }
  }

  if (state === "verify_email") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-cyan-50 border border-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-cyan-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-mono text-xl font-semibold text-slate-900 mb-2">
          Verify your email
        </h2>
        <p className="font-sans text-sm text-slate-600 mb-4">
          We've sent a verification link to<br />
          <span className="font-semibold">{email}</span>
        </p>
        <p className="font-sans text-xs text-slate-500 mb-6">
          Click the link in your email to confirm your account and get started.
        </p>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleResend}
            disabled={resendState === "sending" || resendState === "sent"}
            className="font-sans text-xs text-cyan-700 hover:text-cyan-800 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-colors"
          >
            {resendState === "sending"
              ? "Sending…"
              : resendState === "sent"
              ? "Email sent!"
              : "Didn't get it? Resend email"}
          </button>
          {resendState === "error" && (
            <p className="font-sans text-xs text-red-500">Failed to resend. Try again.</p>
          )}
        </div>
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
        Create account
      </h1>
      <p className="font-sans text-sm text-slate-600 mb-8">
        Set up your client dashboard.
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

        <div className="space-y-1.5">
          <Label htmlFor="company">Company (optional)</Label>
          <Input
            id="company"
            type="text"
            placeholder="Your company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={state === "loading"}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={state === "loading"}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="font-sans text-xs text-slate-400">Minimum 8 characters</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={state === "loading"}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {state === "error" && (
          <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={state === "loading" || !email || !password || !confirmPassword}
        >
          {state === "loading" ? (
            "Creating account…"
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="font-sans text-xs text-slate-400 mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
