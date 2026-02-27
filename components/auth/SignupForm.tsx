"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type State = "idle" | "loading" | "error" | "success";

export function SignupForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const router = useRouter();

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

    const supabase = createClient();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: company || undefined,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setState("error");
    } else {
      setState("success");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-mono text-xl font-semibold text-slate-900 mb-2">
          Account created
        </h2>
        <p className="font-sans text-sm text-slate-600">
          Welcome! Redirecting to your dashboard...
        </p>
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
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={state === "loading"}
          />
          <p className="font-sans text-xs text-slate-400">Minimum 8 characters</p>
        </div>

        {state === "error" && (
          <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={state === "loading" || !email || !password}
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
