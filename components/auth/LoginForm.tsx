"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type State = "idle" | "loading" | "error";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setState("error");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
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
        Client login
      </h1>
      <p className="font-sans text-sm text-slate-600 mb-8">
        Sign in to access your dashboard.
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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
            "Signing in…"
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="font-sans text-xs text-slate-400 mt-6 text-center">
        <Link href="/reset-password" className="text-cyan-700 hover:underline">
          Forgot password?
        </Link>
      </p>

      <p className="font-sans text-xs text-slate-400 mt-3 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-cyan-700 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
