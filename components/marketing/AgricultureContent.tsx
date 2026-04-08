"use client";

import Image from "next/image";
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
      "Identify canopy gaps, irrigation inefficiencies, and disease pressure in macadamia, coffee, and tropical fruit operations before they become yield losses.",
    tags: ["NDVI", "Canopy analysis", "Stress detection"],
  },
  {
    title: "Row Crops & Vegetables",
    description:
      "Monitor stand uniformity, growth variability, and nutrient status across large-scale vegetable and grain operations with per-field resolution.",
    tags: ["Growth monitoring", "Uniformity mapping"],
  },
  {
    title: "Pasture & Grazing Land",
    description:
      "Track biomass availability and recovery after grazing events. Make smarter rotation decisions with quantified pasture data.",
    tags: ["Biomass", "Rotation planning"],
  },
];

const deliverables = [
  { icon: TrendingUp, label: "NDVI maps at 2cm/px resolution" },
  { icon: Eye, label: "Crop stress zone identification" },
  { icon: Droplets, label: "Irrigation efficiency overlay" },
  { icon: BarChart3, label: "Historical comparison (per-flight)" },
  { icon: Leaf, label: "Canopy cover percentage" },
  { icon: ArrowRight, label: "Written recommendations report" },
];

// Mock NDVI output from a macadamia orchard flight, March 2025
const sampleNdvi = {
  count: 2847302,
  mean: 0.71,
  median: 0.73,
  std: 0.14,
  min: 0.08,
  max: 0.95,
  p10: 0.52,
  p25: 0.64,
  p75: 0.81,
  p90: 0.88,
  class_pct: {
    "Very Healthy": 38.2,
    "Healthy": 43.5,
    "Moderate": 11.8,
    "Stressed": 4.9,
    "Severely Stressed": 1.6,
  },
  concern_zone_pct: 1.6,
};

export function AgricultureContent() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[560px] border-b border-slate-200 overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80"
          alt="Aerial view of agricultural fields"
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
              <div className="w-10 h-10 bg-green-900/60 border border-green-700/40 rounded flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-400" />
              </div>
              <Badge variant="success">Agriculture</Badge>
            </motion.div>
            <motion.h1
              className="font-mono text-5xl md:text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.07, ease: "easeOut" }}
            >
              See your crops differently.
            </motion.h1>
            <motion.p
              className="font-sans text-xl text-slate-200 mt-6 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
            >
              NDVI mapping, crop stress detection, and growth monitoring for
              Hawaii&apos;s orchards, row crops, and pasture, delivered within
              48 hours of every flight.
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
                Every flight produces a stats report like the one on the right,
                alongside GeoTIFF maps and a written recommendations PDF.
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
              <NdviStatsCard stats={sampleNdvi} capturedAt="2025-03-14T08:30:00Z" />
            </motion.div>
          </div>
        </div>
      </section>

      <PilotCTA />
    </main>
  );
}
