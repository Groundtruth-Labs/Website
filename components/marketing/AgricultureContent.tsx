"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Leaf,
  TrendingUp,
  Droplets,
  Eye,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NdviStatsCard } from "@/components/dashboard/NdviStatsCard";
import { PilotCTA } from "@/components/marketing/PilotCTA";

const useCases = [
  {
    title: "Orchards & Tree Crops",
    description:
      "Catch irrigation deficits and stress pressure in macadamia, coffee, and tropical fruit operations before they show up as yield losses. NDWI flags water stress before it's visible.",
    tags: ["NDVI", "NDWI", "Stress detection"],
  },
  {
    title: "Row Crops & Vegetables",
    description:
      "Monitor growth variability and stress patterns across large vegetable and grain operations. Sentinel-2 covers your whole field every 5 days, not just the rows you walked.",
    tags: ["Growth monitoring", "Change detection"],
  },
  {
    title: "Pasture & Grazing Land",
    description:
      "Track vegetation recovery between grazing cycles. Trend charts show whether pastures are improving or declining, so rotation decisions have data behind them.",
    tags: ["NDVI trends", "Rotation planning"],
  },
];

const deliverables = [
  { icon: TrendingUp, label: "NDVI maps at 10m Sentinel-2 resolution" },
  { icon: Droplets, label: "NDWI water stress maps (irrigation deficit and waterlogging)" },
  { icon: Eye, label: "Crop stress zones with GPS coordinates and severity ratings" },
  { icon: BarChart3, label: "Week-over-week change detection, every 5-day cycle" },
  { icon: Leaf, label: "Trend charts with full season history" },
  { icon: ArrowRight, label: "Written recommendations report, plain English" },
];

export function AgricultureContent() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="w-10 h-10 bg-green-50 border border-green-100 rounded flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <Badge variant="success">Agriculture</Badge>
          </motion.div>
          <motion.h1
            className="font-mono text-5xl md:text-6xl font-bold text-slate-900 leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.07, ease: "easeOut" }}
          >
            See your crops differently.
          </motion.h1>
          <motion.p
            className="font-sans text-xl text-slate-600 mt-6 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
          >
            NDVI and NDWI monitoring for Hawaii&apos;s orchards, row crops,
            and pasture, updated automatically every 5 days from Sentinel-2
            satellite data. No flights, no scheduling.
          </motion.p>
          <motion.div
            className="flex gap-4 mt-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
          >
            <Button size="lg" asChild>
              <Link href="/book">Book discovery call</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn about our model</Link>
            </Button>
          </motion.div>
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
              Works across every operation type.
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
                      className="font-mono text-xs bg-green-50 text-green-700 border border-green-100 rounded px-2 py-0.5"
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
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
                What you receive
              </span>
              <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-6">
                What every agriculture engagement includes.
              </h2>
              <ul className="space-y-3 mb-6">
                {deliverables.map(({ label }, i) => (
                  <motion.li
                    key={label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="font-sans text-sm text-slate-700">{label}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                Every 5-day satellite pass produces a stats report like the one
                on the right, alongside GeoTIFF maps and a written
                recommendations PDF. Delivered to your dashboard automatically.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Sample analytics output
              </p>
              <NdviStatsCard />
            </motion.div>
          </div>
        </div>
      </section>

      <PilotCTA />
    </main>
  );
}
