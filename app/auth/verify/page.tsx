import { Suspense } from "react";
import { VerifyEmailButton } from "@/components/auth/VerifyEmailButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm your email | Groundtruth Labs",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 bg-cyan-50 border border-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-cyan-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-mono text-2xl font-bold text-slate-900 mb-3">
          Confirm your email
        </h1>
        <p className="font-sans text-sm text-slate-600 mb-8">
          Click the button below to verify your email address and access your dashboard.
        </p>

        <Suspense fallback={
          <div className="w-full h-10 bg-slate-100 animate-pulse rounded" />
        }>
          <VerifyEmailButton />
        </Suspense>
      </div>
    </div>
  );
}
