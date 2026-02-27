"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitBooking, type FormState } from "@/app/book/actions";

const industries = [
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "solar", label: "Solar" },
  { value: "golf", label: "Golf" },
  { value: "other", label: "Other" },
];

const times = [
  { value: "morning", label: "Morning", sub: "8am – 12pm HST" },
  { value: "afternoon", label: "Afternoon", sub: "12pm – 5pm HST" },
  { value: "flexible", label: "Flexible", sub: "Whatever works" },
];

const initial: FormState = { status: "idle" };

export function BookCallForm() {
  const [state, action, pending] = useActionState(submitBooking, initial);

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center py-16"
      >
        <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h2 className="font-mono text-2xl font-bold text-slate-900 mb-3">
          We&apos;ll be in touch.
        </h2>
        <p className="font-sans text-slate-500 max-w-sm mx-auto">
          Thanks for reaching out. Expect to hear from us within one business
          day.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
            Full name <span className="text-cyan-700">*</span>
          </label>
          <input
            name="full_name"
            required
            placeholder="Jane Smith"
            className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
            Email <span className="text-cyan-700">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
            Phone
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="(808) 555-0123"
            className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
            Company
          </label>
          <input
            name="company"
            placeholder="Acme Farms LLC"
            className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
          Site location
        </label>
        <input
          name="location"
          placeholder="e.g. Kailua, HI or North Shore, Oahu"
          className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-2">
          Industry
        </label>
        <div className="flex flex-wrap gap-2">
          {industries.map((ind) => (
            <label key={ind.value} className="cursor-pointer">
              <input
                type="radio"
                name="industry"
                value={ind.value}
                className="sr-only peer"
              />
              <span className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded text-sm font-mono text-slate-600 peer-checked:border-cyan-700 peer-checked:text-cyan-700 peer-checked:bg-cyan-50 transition-all">
                {ind.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Best time */}
      <div>
        <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-2">
          Best time to call
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {times.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input
                type="radio"
                name="best_time"
                value={t.value}
                className="sr-only peer"
              />
              <div className="border border-slate-200 rounded p-3 peer-checked:border-cyan-700 peer-checked:bg-cyan-50 transition-all">
                <p className="font-mono text-sm font-semibold text-slate-900 peer-checked:text-cyan-700">
                  {t.label}
                </p>
                <p className="font-sans text-xs text-slate-400 mt-0.5">
                  {t.sub}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block font-mono text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
          Anything else we should know?
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your site, what you're trying to learn from the data, rough acreage, etc."
          className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {state.status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-sans text-sm text-red-600"
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </span>
        ) : (
          "Request discovery call"
        )}
      </Button>

      <p className="font-sans text-xs text-slate-400">
        No commitment. We&apos;ll reach out to scope the engagement before any
        invoice is issued.
      </p>
    </form>
  );
}
