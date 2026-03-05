"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUiStore } from "@/lib/store/uiStore";
import { Map, AlertTriangle, Grid3X3, GitCompare, BarChart3, Download } from "lucide-react";

type Category = "agriculture" | "construction" | "both";

const CARDS = [
  { icon: Map, title: "NDVI Maps", description: "Normalized Difference Vegetation Index imagery that reveals crop health, stress zones, and variability across your fields.", badge: "Agriculture", category: "agriculture" as Category, spec: "GeoTIFF · 2 cm/px resolution" },
  { icon: AlertTriangle, title: "Crop Stress Reports", description: "Pinpoints where intervention is needed, with severity ratings and specific next steps for each zone.", badge: "Agriculture", category: "agriculture" as Category, spec: "PDF + annotated map overlay" },
  { icon: GitCompare, title: "Change Detection", description: "Flight-over-flight comparison that automatically highlights what moved, grew, or changed between visits.", badge: "Construction", category: "construction" as Category, spec: "Side-by-side overlay · diff export" },
  { icon: BarChart3, title: "Site Progress Reports", description: "Structured progress documentation with visual milestones, volume estimates, and percent-complete breakdowns.", badge: "Construction", category: "construction" as Category, spec: "PDF · volume + area calculations" },
  { icon: Grid3X3, title: "Orthomosaic Imagery", description: "High-resolution georeferenced aerial images stitched into a single accurate map of your site or field.", badge: "Both", category: "both" as Category, spec: "GeoTIFF · sub-5 cm accuracy" },
  { icon: Download, title: "Dashboard Exports", description: "Every deliverable lives in your secure client dashboard, available for download the moment it's ready.", badge: "All clients", category: "both" as Category, spec: "GIS + PDF · immediate access" },
];

const INTERVAL_MS = 2800;

const categoryStyles: Record<Category, { accent: string; iconBg: string; iconColor: string; badgeColor: string; specColor: string; progressColor: string }> = {
  agriculture: { accent: "bg-green-400", iconBg: "bg-green-900/40", iconColor: "text-green-400", badgeColor: "text-green-400 bg-green-900/30 border-green-800/60", specColor: "text-green-500/70", progressColor: "bg-green-400" },
  construction: { accent: "bg-cyan-500", iconBg: "bg-cyan-900/40", iconColor: "text-cyan-400", badgeColor: "text-cyan-400 bg-cyan-900/30 border-cyan-800/60", specColor: "text-cyan-500/70", progressColor: "bg-cyan-400" },
  both: { accent: "bg-slate-500", iconBg: "bg-slate-700/60", iconColor: "text-slate-300", badgeColor: "text-slate-400 bg-slate-700/40 border-slate-600/60", specColor: "text-slate-500", progressColor: "bg-slate-400" },
};

// ── Main component ──────────────────────────────────────────────────────────
export function Deliverables() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const setDroneActive = useUiStore((s) => s.setDroneActive);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  // Hide navbar while section is visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        setDroneActive(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setDroneActive]);

  // Auto-advance while in view
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % CARDS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [inView]);

  const card = CARDS[active];
  const styles = categoryStyles[card.category];
  const Icon = card.icon;

  return (
    <section ref={sectionRef} className="bg-slate-900 py-24 lg:py-32">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[2fr,3fr] gap-12 lg:gap-20 items-center">

        {/* Left: header + nav list */}
        <div>
          <span className="block font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-5">
            What you get
          </span>
          <h2 className="font-mono text-4xl lg:text-5xl font-bold text-white leading-tight mb-10">
            Every engagement<br />includes.
          </h2>
          <div className="flex flex-col gap-3.5">
            {CARDS.map((c, i) => (
              <button
                key={c.title}
                onClick={() => setActive(i)}
                className="flex items-center gap-3 text-left group"
              >
                <motion.div
                  animate={{ scale: i === active ? 1.4 : 0.7, opacity: i === active ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                  className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0"
                />
                <span className={`font-mono text-xs truncate transition-colors duration-200 ${i === active ? "text-white" : "text-slate-500 group-hover:text-slate-400"}`}>
                  {String(i + 1).padStart(2, "0")} {c.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: animated card */}
        <div className="relative h-[340px] lg:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full max-w-lg bg-slate-800/70 border border-slate-700/80 rounded overflow-hidden">
                <div className={`h-0.5 w-full ${styles.accent}`} />
                {/* Progress bar */}
                <div className="h-px w-full bg-slate-700/60 relative overflow-hidden">
                  <motion.div
                    key={`bar-${active}`}
                    className={`absolute inset-y-0 left-0 ${styles.progressColor} opacity-60`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded ${styles.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${styles.iconColor}`} />
                    </div>
                    <span className={`font-mono text-[10px] font-semibold uppercase tracking-widest border rounded px-2.5 py-1 ${styles.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-mono text-2xl font-bold text-white mb-3 leading-tight">{card.title}</h3>
                  <p className="font-sans text-slate-400 leading-relaxed mb-6">{card.description}</p>
                  <p className={`font-mono text-[10px] font-medium uppercase tracking-widest ${styles.specColor}`}>{card.spec}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
