"use client";

import { motion } from "motion/react";
import { Award, MapPin, Clock, Users, FlaskConical } from "lucide-react";

const pills = [
  { icon: Award, label: "ISEF-recognized research background" },
  { icon: MapPin, label: "Hawaii-based team" },
  { icon: Clock, label: "48hr standard turnaround" },
  { icon: Users, label: "Licensed FAA drone partners" },
  { icon: FlaskConical, label: "Pilot project available" },
];

const blocks = [
  {
    title: "Research-grade rigor.",
    body: "Our methods come from ISEF-recognized research work. Everything we deliver is reproducible, documented, and defensible, not a black box.",
  },
  {
    title: "Local expertise.",
    body: "We know Hawaii's microclimates, terrain, and how farming operates here. Every report comes with context, not just numbers.",
  },
  {
    title: "Asset-light model.",
    body: "No drone ownership keeps overhead low. We focus entirely on the analysis, which is what you're actually paying for.",
  },
];

export function TrustSignals() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
            Why Groundtruth
          </span>
          <h2 className="font-mono text-4xl font-bold text-slate-900 mt-3">
            Built for trust.
          </h2>
        </motion.div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-3 mb-16">
          {pills.map(({ icon: Icon, label }, i) => (
            <motion.div
              suppressHydrationWarning
              key={label}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded px-4 py-2 shadow-sm"
            >
              <Icon className="w-4 h-4 text-cyan-700 flex-shrink-0" />
              <span className="font-sans text-sm text-slate-700">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* Prose blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blocks.map(({ title, body }, i) => (
            <motion.div
              suppressHydrationWarning
              key={title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              className="border-l-2 border-cyan-700 pl-5"
            >
              <h3 className="font-mono text-base font-semibold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
