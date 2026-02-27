import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Access your Groundtruth Labs client dashboard.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
        <p className="mt-8 font-sans text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>

      {/* Right panel — visual */}
      <div className="hidden lg:flex flex-1 bg-cyan-700 relative overflow-hidden items-center justify-center">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative z-10 text-center px-12">
          <p className="font-mono text-xs font-semibold text-cyan-200 uppercase tracking-widest mb-4">
            Client portal
          </p>
          <h2 className="font-mono text-3xl font-bold text-white leading-tight">
            Your data,
            <br />
            on demand.
          </h2>
          <p className="font-sans text-sm text-cyan-100 mt-4 leading-relaxed">
            Access your NDVI maps, orthomosaics, progress reports, and analysis,
            all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
