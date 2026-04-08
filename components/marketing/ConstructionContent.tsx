"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  HardHat,
  BarChart3,
  GitCompare,
  ClipboardList,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PilotCTA } from "@/components/marketing/PilotCTA";

const useCases = [
  {
    title: "Commercial Development",
    description:
      "Give owners, lenders, and GCs a clear picture of progress. Regular aerial documentation shows exactly what's done vs. what was scheduled.",
    tags: ["Progress tracking", "Stakeholder reports"],
  },
  {
    title: "Infrastructure & Civil",
    description:
      "Track earthwork volumes, grading progress, and site mobilization with accurate aerial measurement data between site visits.",
    tags: ["Volume calc", "Earthwork", "Change detection"],
  },
  {
    title: "Residential Subdivision",
    description:
      "Document phase-by-phase progression across large residential projects. Catch discrepancies early with before-and-after comparisons.",
    tags: ["Phase documentation", "Comparison"],
  },
];

const deliverables = [
  { icon: BarChart3, label: "Site progress report with percent-complete" },
  { icon: GitCompare, label: "Change detection overlays between flights" },
  { icon: Eye, label: "High-resolution orthomosaic" },
  { icon: ClipboardList, label: "Volume and area calculations" },
  { icon: HardHat, label: "Compliance-ready documentation package" },
  { icon: CheckCircle2, label: "Written summary with flagged concerns" },
];

export function ConstructionContent() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[560px] border-b border-slate-200 overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80"
          alt="Aerial view of construction site"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/55 to-slate-900/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-xl">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-10 h-10 bg-cyan-900/60 border border-cyan-700/40 rounded flex items-center justify-center">
                <HardHat className="w-5 h-5 text-cyan-400" />
              </div>
              <Badge variant="default">Construction</Badge>
            </motion.div>
            <motion.h1
              className="font-mono text-5xl md:text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.07, ease: "easeOut" }}
            >
              Full site visibility, every flight.
            </motion.h1>
            <motion.p
              className="font-sans text-xl text-slate-200 mt-6 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
            >
              Site progress tracking, change detection, and aerial documentation
              for construction projects across Hawaii, delivered within 48
              hours of capture.
            </motion.p>
            <motion.div
              className="flex gap-4 mt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
            >
              <Button size="lg" asChild className="bg-cyan-700 hover:bg-cyan-800 text-white border-0">
                <Link href="/book">Book discovery call</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link href="/about">Learn about our model</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
              Use cases
            </span>
            <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-12">
              Every phase, every project type.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                className="border border-slate-200 bg-white rounded p-6 hover:shadow-sm transition-shadow"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.09, ease: "easeOut" }}
              >
                <h3 className="font-mono text-sm font-semibold text-slate-900 mb-2">
                  {uc.title}
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed mb-4">
                  {uc.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs bg-cyan-50 text-cyan-700 border border-cyan-100 rounded px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
                What you receive
              </span>
              <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-8">
                What every construction engagement includes.
              </h2>
              <ul className="space-y-3">
                {deliverables.map(({ label }, i) => (
                  <motion.li
                    key={label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                    <span className="font-sans text-sm text-slate-700">{label}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Sample progress report
              </p>
              <div className="border border-slate-200 bg-white rounded overflow-hidden shadow-sm">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-900">Waimea Commercial Dev</p>
                    <p className="font-sans text-xs text-slate-400 mt-0.5">Flight 4 of 8 · March 14, 2025</p>
                  </div>
                  <span className="font-mono text-xs bg-cyan-50 text-cyan-700 border border-cyan-100 rounded px-2 py-1">In progress</span>
                </div>
                {/* Phase progress */}
                <div className="px-5 py-4 space-y-3.5">
                  <p className="font-mono text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Phase completion</p>
                  {[
                    { phase: "Site prep / earthwork", pct: 100, done: true },
                    { phase: "Foundation & footings", pct: 88, done: false },
                    { phase: "Structural framing", pct: 53, done: false },
                    { phase: "MEP rough-in", pct: 12, done: false },
                    { phase: "Exterior envelope", pct: 0, done: false },
                  ].map(({ phase, pct, done }) => (
                    <div key={phase}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-sans text-xs text-slate-600">{phase}</span>
                        <span className={`font-mono text-xs font-semibold ${done ? "text-green-600" : "text-slate-700"}`}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${done ? "bg-green-500" : "bg-cyan-600"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Metrics row */}
                <div className="px-5 py-3.5 border-t border-slate-100 grid grid-cols-3 gap-3">
                  {[
                    { label: "Area surveyed", value: "3.8 ac" },
                    { label: "Changed area", value: "0.41 ac" },
                    { label: "Flags raised", value: "2" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{label}</p>
                      <p className="font-mono text-base font-bold text-slate-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                {/* Footer note */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                  <p className="font-sans text-[11px] text-slate-400">
                    Flags: minor grading deviation in Zone C (NE corner) and standing water near foundation grid B-4. Full annotated orthomosaic included.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <PilotCTA />
    </main>
  );
}
