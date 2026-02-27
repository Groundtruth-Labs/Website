import type { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  TrendingUp,
  Droplets,
  Eye,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PilotCTA } from "@/components/marketing/PilotCTA";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NdviStatsCard } from "@/components/dashboard/NdviStatsCard";

export const metadata: Metadata = {
  title: "Agriculture Analytics",
  description:
    "NDVI mapping, crop stress detection, and precision monitoring for orchards, row crops, and pasture across Hawaii.",
};

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

export default function AgriculturePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 border border-green-100 rounded flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="success">Agriculture</Badge>
            </div>
            <h1 className="font-mono text-5xl md:text-6xl font-bold text-slate-900 leading-tight max-w-3xl">
              See your crops differently.
            </h1>
            <p className="font-sans text-xl text-slate-600 mt-6 max-w-2xl leading-relaxed">
              NDVI mapping, crop stress detection, and growth monitoring for
              Hawaii&apos;s orchards, row crops, and pasture, delivered within
              48 hours of every flight.
            </p>
            <div className="flex gap-4 mt-10">
              <Button size="lg" asChild>
                <Link href="/book">Book discovery call</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn about our model</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
              Use cases
            </span>
            <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-12">
              Built for every operation type.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="border border-slate-200 bg-white rounded p-6 hover:shadow-sm transition-shadow"
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 items-center">
              <div>
                <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
                  What you receive
                </span>
                <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-6">
                  Every agriculture engagement includes.
                </h2>
                <ul className="space-y-3 mb-6">
                  {deliverables.map(({ label }) => (
                    <li key={label} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-sans text-sm text-slate-700">
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">
                  Every flight produces a stats report like the one on the right,
                  alongside GeoTIFF maps and a written recommendations PDF.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Sample analytics output
                </p>
                <NdviStatsCard />
              </div>
            </div>
          </div>
        </section>

        <PilotCTA />
      </main>
      <Footer />
    </>
  );
}
