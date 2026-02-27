import type { Metadata } from "next";
import Link from "next/link";
import {
  HardHat,
  BarChart3,
  GitCompare,
  ClipboardList,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PilotCTA } from "@/components/marketing/PilotCTA";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Construction Analytics",
  description:
    "Site progress tracking, change detection, and aerial documentation for construction projects across Hawaii.",
};

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

export default function ConstructionPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-50 border border-cyan-100 rounded flex items-center justify-center">
                <HardHat className="w-5 h-5 text-cyan-700" />
              </div>
              <Badge variant="default">Construction</Badge>
            </div>
            <h1 className="font-mono text-5xl md:text-6xl font-bold text-slate-900 leading-tight max-w-3xl">
              Full site visibility, every flight.
            </h1>
            <p className="font-sans text-xl text-slate-600 mt-6 max-w-2xl leading-relaxed">
              Site progress tracking, change detection, and aerial documentation
              for construction projects across Hawaii, delivered within 48
              hours of capture.
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
              Every phase, every project type.
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
                        className="font-mono text-xs bg-cyan-50 text-cyan-700 border border-cyan-100 rounded px-2 py-0.5"
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
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
                  What you receive
                </span>
                <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-8">
                  Every construction engagement includes.
                </h2>
                <ul className="space-y-3">
                  {deliverables.map(({ label }) => (
                    <li key={label} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                      <span className="font-sans text-sm text-slate-700">
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded p-8 shadow-sm">
                <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  Sample output
                </p>
                <div className="aspect-video bg-gradient-to-br from-slate-700 via-slate-500 to-cyan-700 rounded opacity-60 flex items-center justify-center">
                  <span className="font-mono text-xs text-white/70 uppercase tracking-widest">
                    Orthomosaic - Sample
                  </span>
                </div>
                <p className="font-sans text-xs text-slate-400 mt-3">
                  Orthomosaics delivered as GeoTIFF + PDF with annotated progress overlay.
                </p>
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
