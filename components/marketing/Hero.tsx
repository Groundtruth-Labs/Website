"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Clock, Layers, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";

const HeroCanvas = dynamic(() => import("@/components/canvas/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

const stats = [
  { icon: Clock, value: "48hr", label: "Turnaround" },
  { icon: Layers, value: "NDVI + Ortho", label: "Core outputs" },
  { icon: MapPin, value: "Hawaii", label: "Based locally" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Dot grid moves at 40% scroll speed — slow parallax background
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  // Content layer moves at 18% — subtler, stays readable longer
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-50"
    >
      {/* Dot grid background — parallax slow layer */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-dot-grid bg-dot-16 opacity-60 z-0"
        aria-hidden
      />

      {/* R3F canvas */}
      <HeroCanvas />

      {/* Content — moves slightly faster than bg, creates depth */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20"
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
              Remote Sensing Analytics · Hawaii
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            suppressHydrationWarning
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight"
          >
            Turn aerial data into{" "}
            <span className="text-cyan-700">decisions</span>{" "}
            you can use.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            suppressHydrationWarning
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="font-sans text-xl text-slate-600 mt-6 max-w-2xl leading-relaxed"
          >
            We run NDVI maps, orthomosaics, and site progress reports for farms
            and construction sites across Hawaii. You get the analysis. We
            handle everything else.
          </motion.p>

          {/* CTAs */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.44 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Button size="lg" asChild>
              <Link href="/book">Book discovery call</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about" className="inline-flex items-center gap-2">
                Request pilot project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-slate-200"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <Icon className="w-4 h-4 text-cyan-700" />
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-amber-500 leading-tight">
                    {value}
                  </div>
                  <div className="font-sans text-xs text-slate-500 uppercase tracking-wide">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-slate-400 to-transparent" />
        <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
          Scroll
        </span>
      </div>
    </section>
  );
}
