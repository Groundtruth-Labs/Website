"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { saveOnboarding } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";

const industries = [
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "solar", label: "Solar" },
  { value: "golf", label: "Golf" },
  { value: "other", label: "Other" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-mono"
      size="lg"
    >
      {pending ? "Setting up…" : "Go to my dashboard"}
    </Button>
  );
}

interface OnboardingFormProps {
  email: string;
  prefill?: {
    contact_name?: string | null;
    company_name?: string | null;
    industry?: string | null;
    location?: string | null;
  };
}

export function OnboardingForm({ email, prefill }: OnboardingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={saveOnboarding} className="space-y-5">
      {/* Company name */}
      <div>
        <label
          htmlFor="company_name"
          className="block font-mono text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-widest"
        >
          Company name <span className="text-red-400">*</span>
        </label>
        <input
          id="company_name"
          name="company_name"
          type="text"
          required
          defaultValue={prefill?.company_name ?? ""}
          placeholder="e.g. Maui Farms LLC"
          className="w-full font-sans text-sm border border-slate-200 rounded px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 focus:border-cyan-700 transition-colors"
        />
      </div>

      {/* Your name */}
      <div>
        <label
          htmlFor="contact_name"
          className="block font-mono text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-widest"
        >
          Your name <span className="text-red-400">*</span>
        </label>
        <input
          id="contact_name"
          name="contact_name"
          type="text"
          required
          defaultValue={prefill?.contact_name ?? ""}
          placeholder="e.g. Kai Nakamura"
          className="w-full font-sans text-sm border border-slate-200 rounded px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 focus:border-cyan-700 transition-colors"
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label
          htmlFor="contact_email"
          className="block font-mono text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-widest"
        >
          Email
        </label>
        <input
          id="contact_email"
          name="contact_email"
          type="email"
          readOnly
          value={email}
          className="w-full font-sans text-sm border border-slate-100 rounded px-3 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed"
        />
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="industry"
          className="block font-mono text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-widest"
        >
          Industry <span className="text-red-400">*</span>
        </label>
        <select
          id="industry"
          name="industry"
          required
          defaultValue={prefill?.industry ?? ""}
          className="w-full font-sans text-sm border border-slate-200 rounded px-3 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 focus:border-cyan-700 transition-colors appearance-none"
        >
          <option value="" disabled>
            Select your industry
          </option>
          {industries.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block font-mono text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-widest"
        >
          Location{" "}
          <span className="font-sans text-xs font-normal text-slate-400 normal-case tracking-normal">
            optional
          </span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          defaultValue={prefill?.location ?? ""}
          placeholder="e.g. Kailua, Oahu"
          className="w-full font-sans text-sm border border-slate-200 rounded px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 focus:border-cyan-700 transition-colors"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
