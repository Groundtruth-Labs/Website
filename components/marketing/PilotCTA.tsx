"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const includes = [
  "One flight with a licensed local partner",
  "Full orthomosaic or NDVI deliverable set",
  "Written analysis report with recommendations",
  "48-hour turnaround from capture",
];

export function PilotCTA() {
  return (
    <section className="relative py-24 bg-cyan-700 overflow-hidden">
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 bg-dot-grid bg-dot-16 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="font-mono text-xs font-semibold text-cyan-200 uppercase tracking-widest">
              Start small
            </span>
            <h2 className="font-mono text-4xl font-bold text-white mt-3 leading-tight">
              Start with a pilot project.
            </h2>
            <p className="font-sans text-cyan-100 mt-4 text-lg leading-relaxed">
              One flight, one full deliverable set, one written report. See
              exactly what you&apos;re getting before you commit to anything
              ongoing.
            </p>

            {/* What's included */}
            <ul className="space-y-3 mt-8">
              {includes.map((item, i) => (
                <motion.li
                  suppressHydrationWarning
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.08, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-cyan-50">{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button
                size="lg"
                className="bg-white text-cyan-800 hover:bg-cyan-50"
                asChild
              >
                <Link href="/book">Book discovery call</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-cyan-300 text-white hover:bg-cyan-600 hover:text-white hover:border-cyan-400"
                asChild
              >
                <Link href="/services/agriculture" className="inline-flex items-center gap-2">
                  See sample deliverables
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: pricing hint card */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded p-8">
              <p className="font-mono text-xs font-semibold text-cyan-200 uppercase tracking-widest mb-4">
                Pricing model
              </p>
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-mono text-sm font-semibold text-white">
                      Pilot project
                    </span>
                    <span className="font-mono text-lg font-bold text-amber-400">
                      Custom quote
                    </span>
                  </div>
                  <p className="font-sans text-xs text-cyan-200">
                    Scoped to your specific site and deliverable needs
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-mono text-sm font-semibold text-white">
                      Recurring monitoring
                    </span>
                    <span className="font-mono text-sm font-bold text-amber-400">
                      Monthly / seasonal
                    </span>
                  </div>
                  <p className="font-sans text-xs text-cyan-200">
                    Fixed schedule, consistent outputs, discounted vs. one-off
                  </p>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-mono text-sm font-semibold text-white">
                      One-time analysis
                    </span>
                    <span className="font-mono text-sm font-bold text-amber-400">
                      Per-project
                    </span>
                  </div>
                  <p className="font-sans text-xs text-cyan-200">
                    Single flight + deliverable package, no ongoing commitment
                  </p>
                </div>
              </div>
              <p className="font-sans text-xs text-cyan-300 mt-6 pt-4 border-t border-white/10">
                Every project starts with a discovery call. We scope it before
                we invoice anything.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
