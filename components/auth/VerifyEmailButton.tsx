"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function VerifyEmailButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // The email link from Resend points here with the Supabase token_hash + type params
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/onboarding";

  async function handleConfirm() {
    if (!tokenHash || !type) {
      setErrorMsg("Invalid or missing verification link. Please request a new one.");
      setState("error");
      return;
    }

    setState("loading");

    // Now redirect to the auth callback which will consume the token
    const params = new URLSearchParams({ token_hash: tokenHash, type, next });
    router.push(`/auth/callback?${params.toString()}`);
  }

  if (!tokenHash || !type) {
    return (
      <div className="text-center">
        <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-100 rounded px-4 py-3">
          This link is invalid or has expired. Please request a new verification email.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handleConfirm}
        disabled={state === "loading"}
        className="w-full"
        size="lg"
      >
        {state === "loading" ? (
          "Verifying…"
        ) : (
          <>
            Confirm email address
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      {state === "error" && (
        <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 w-full text-center">
          {errorMsg}
        </p>
      )}

      <p className="font-sans text-xs text-slate-400">
        Wrong email?{" "}
        <a href="/signup" className="text-cyan-700 hover:underline">
          Sign up again
        </a>
      </p>
    </div>
  );
}
