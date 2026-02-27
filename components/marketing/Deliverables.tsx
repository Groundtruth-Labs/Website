"use client";

import { motion } from "motion/react";
import {
  Map,
  AlertTriangle,
  Grid3X3,
  GitCompare,
  BarChart3,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const deliverables = [
  {
    icon: Map,
    title: "NDVI Maps",
    description:
      "Normalized Difference Vegetation Index imagery that reveals crop health, stress zones, and variability across your fields.",
    badge: "Agriculture",
    badgeVariant: "success" as const,
  },
  {
    icon: AlertTriangle,
    title: "Crop Stress Reports",
    description:
      "Pinpoints where intervention is needed, with severity ratings and specific next steps.",
    badge: "Agriculture",
    badgeVariant: "success" as const,
  },
  {
    icon: Grid3X3,
    title: "Orthomosaic Imagery",
    description:
      "High-resolution georeferenced aerial images stitched into a single accurate map of your site or field.",
    badge: "Both",
    badgeVariant: "muted" as const,
  },
  {
    icon: GitCompare,
    title: "Change Detection",
    description:
      "Side-by-side comparison of site conditions over time, automatically highlighting what changed between flights.",
    badge: "Construction",
    badgeVariant: "default" as const,
  },
  {
    icon: BarChart3,
    title: "Site Progress Reports",
    description:
      "Structured progress documentation with visual milestones, volume estimates, and percent-complete breakdowns.",
    badge: "Construction",
    badgeVariant: "default" as const,
  },
  {
    icon: Download,
    title: "Dashboard Exports",
    description:
      "All deliverables accessible via your secure client dashboard. Download anytime in standard GIS or PDF formats.",
    badge: "All clients",
    badgeVariant: "muted" as const,
  },
];

export function Deliverables() {
  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
            What you get
          </span>
          <h2 className="font-mono text-4xl font-bold text-slate-900 mt-3">
            Every engagement includes.
          </h2>
          <p className="font-sans text-slate-600 mt-4 max-w-xl text-lg">
            Standardized deliverable packages so you know exactly what to
            expect, and compare across flights over time.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                suppressHydrationWarning
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.15, ease: "easeOut" } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                className="border border-slate-200 bg-white rounded p-6 hover:shadow-md transition-shadow cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                </div>
                <h3 className="font-mono text-sm font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
