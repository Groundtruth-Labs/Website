"use client";

import { AlertTriangle, Leaf, TrendingUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function NdviEmptyState() {
  return (
    <div className="border border-slate-200 bg-white rounded p-10 text-center">
      <Leaf className="w-8 h-8 text-slate-200 mx-auto mb-3" />
      <p className="font-mono text-sm text-slate-400">No NDVI data yet.</p>
      <p className="font-sans text-xs text-slate-400 mt-1">
        Analytics will appear here once the first flight is processed.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface NdviStats {
  count: number;
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
  class_pct: Record<string, number>;
  concern_zone_pct: number;
}

interface NdviStatsCardProps {
  stats?: NdviStats;
  capturedAt?: string | null;
}

// ---------------------------------------------------------------------------
// Health class config (worst → best; this is also bar order left → right)
// ---------------------------------------------------------------------------
const HEALTH_CLASSES = [
  {
    key: "Severely Stressed",
    short: "Severe",
    bar: "bg-red-500",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  {
    key: "Stressed",
    short: "Stressed",
    bar: "bg-orange-400",
    text: "text-orange-500",
    dot: "bg-orange-400",
  },
  {
    key: "Moderate",
    short: "Moderate",
    bar: "bg-yellow-400",
    text: "text-yellow-600",
    dot: "bg-yellow-400",
  },
  {
    key: "Healthy",
    short: "Healthy",
    bar: "bg-green-400",
    text: "text-green-600",
    dot: "bg-green-400",
  },
  {
    key: "Very Healthy",
    short: "Very Healthy",
    bar: "bg-green-600",
    text: "text-green-700",
    dot: "bg-green-600",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmt(v: number, decimals = 2) {
  return v.toFixed(decimals);
}

function fmtPct(v: number) {
  return `${v.toFixed(1)}%`;
}

function fmtCount(n: number) {
  return n.toLocaleString();
}

/** Map a 0–1 NDVI value to a CSS left-% on the track */
function trackPct(v: number) {
  return `${Math.min(100, Math.max(0, v * 100)).toFixed(2)}%`;
}

/** Auto-generate a plain-English field assessment */
function getAssessment(d: NdviStats): { text: string; tone: "good" | "warn" | "neutral" } {
  const veryHealthyPct = d.class_pct["Very Healthy"] ?? 0;
  const healthyPct = d.class_pct["Healthy"] ?? 0;
  const combinedGood = veryHealthyPct + healthyPct;
  const concern = d.concern_zone_pct;

  if (concern > 15) {
    return {
      text: `Significant stress detected. ${fmtPct(concern)} of the field is severely stressed and needs attention.`,
      tone: "warn",
    };
  }
  if (concern > 5) {
    return {
      text: `Mostly healthy with some concern areas. ${fmtPct(concern)} of vegetation is severely stressed.`,
      tone: "warn",
    };
  }
  if (combinedGood > 90) {
    return {
      text: `Field is in strong shape. ${fmtPct(combinedGood)} of vegetation is healthy or better, with minimal concern zones.`,
      tone: "good",
    };
  }
  return {
    text: `Field health is moderate. Mean NDVI of ${fmt(d.mean)} with ${fmtPct(concern)} in concern zones.`,
    tone: "neutral",
  };
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------
function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "warn" | "good";
}) {
  return (
    <div
      className={`border rounded p-4 flex flex-col gap-1.5 ${
        highlight === "warn"
          ? "border-red-100 bg-red-50"
          : highlight === "good"
          ? "border-green-100 bg-green-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest leading-tight">
        {label}
      </span>
      <span
        className={`font-mono text-2xl font-bold leading-none ${
          highlight === "warn"
            ? "text-red-600"
            : highlight === "good"
            ? "text-green-700"
            : "text-slate-900"
        }`}
      >
        {value}
      </span>
      {sub && (
        <span className="font-sans text-[11px] text-slate-400 leading-tight mt-0.5">
          {sub}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function NdviStatsCard({ stats, capturedAt }: NdviStatsCardProps) {
  if (!stats) return <NdviEmptyState />;
  const d = stats;
  const assessment = getAssessment(d);

  // Normalize values to the p10–p90 range so the track fills edge-to-edge.
  // norm(v) → 0% at p10, 100% at p90.
  const norm = (v: number) =>
    `${(Math.min(1, Math.max(0, (v - d.p10) / (d.p90 - d.p10))) * 100).toFixed(2)}%`;

  const iqrLeft = ((d.p25 - d.p10) / (d.p90 - d.p10)) * 100;
  const iqrWidth = ((d.p75 - d.p25) / (d.p90 - d.p10)) * 100;

  // 3 labeled markers at the edges and center of the zoomed range
  const markers = [
    { label: "p10", value: d.p10, accent: false },
    { label: "median", value: d.median, accent: true },
    { label: "p90", value: d.p90, accent: false },
  ];

  // Tick marks at p25 and p75 — bounding the IQR band
  const iqrTicks = [d.p25, d.p75];

  return (
    <div className="border border-slate-200 bg-white rounded overflow-hidden">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <span className="font-mono text-sm font-semibold text-slate-900">
              NDVI Analysis
            </span>
            {capturedAt && (
              <span className="font-sans text-xs text-slate-400 ml-2">
                {new Date(capturedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
        <span className="font-mono text-xs text-slate-400">
          {fmtCount(d.count)} px analyzed
        </span>
      </div>

      {/* ── Assessment banner ────────────────────────────────────── */}
      <div
        className={`px-6 py-3 border-b flex items-start gap-2.5 ${
          assessment.tone === "warn"
            ? "bg-amber-50 border-amber-100"
            : assessment.tone === "good"
            ? "bg-green-50 border-green-100"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        {assessment.tone === "warn" ? (
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        ) : (
          <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
        )}
        <p
          className={`font-sans text-sm leading-relaxed ${
            assessment.tone === "warn"
              ? "text-amber-800"
              : assessment.tone === "good"
              ? "text-green-800"
              : "text-slate-700"
          }`}
        >
          {assessment.text}
        </p>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* ── Health distribution bar ──────────────────────────── */}
        <div>
          <p className="font-mono text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Vegetation health distribution
          </p>

          {/* Stacked bar */}
          <div className="flex h-8 rounded overflow-hidden gap-px">
            {HEALTH_CLASSES.map((cls) => {
              const pct = d.class_pct[cls.key] ?? 0;
              if (pct === 0) return null;
              return (
                <div
                  key={cls.key}
                  className={`${cls.bar} flex items-center justify-center relative group cursor-default transition-opacity hover:opacity-85`}
                  style={{ width: `${pct}%` }}
                  title={`${cls.key}: ${fmtPct(pct)}`}
                >
                  {pct >= 6 && (
                    <span className="font-mono text-[10px] font-bold text-white/90 select-none">
                      {fmtPct(pct)}
                    </span>
                  )}
                  {pct < 6 && (
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {cls.key}: {fmtPct(pct)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            {HEALTH_CLASSES.slice()
              .reverse()
              .map((cls) => {
                const pct = d.class_pct[cls.key] ?? 0;
                return (
                  <div key={cls.key} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${cls.dot}`} />
                    <span className="font-sans text-xs text-slate-500">
                      {cls.short}
                    </span>
                    <span className={`font-mono text-xs font-semibold ${cls.text}`}>
                      {fmtPct(pct)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ── Key metric cards ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Mean NDVI"
            value={fmt(d.mean)}
            sub={`Median: ${fmt(d.median)}`}
            highlight="good"
          />
          <StatCard
            label="Std deviation"
            value={`±${fmt(d.std)}`}
            sub="Spread across field"
          />
          <StatCard
            label="Concern zone"
            value={fmtPct(d.concern_zone_pct)}
            sub="Severely stressed pixels"
            highlight={d.concern_zone_pct > 10 ? "warn" : undefined}
          />
        </div>

        {/* ── Percentile distribution track ────────────────────── */}
        <div>
          <p className="font-mono text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-5">
            Value spread — p10 to p90
          </p>

          <div className="relative">
            {/* Rail */}
            <div className="h-3 bg-slate-100 rounded-full relative">
              {/* IQR region (p25–p75) */}
              <div
                className="absolute top-0 h-full bg-green-200 rounded"
                style={{ left: `${iqrLeft}%`, width: `${iqrWidth}%` }}
              />
              {/* p25 + p75 boundary ticks */}
              {iqrTicks.map((v) => (
                <div
                  key={v}
                  className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-green-400/60"
                  style={{ left: norm(v) }}
                />
              ))}
              {/* Median line */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-green-600 rounded-full z-10"
                style={{ left: norm(d.median) }}
              />
            </div>

            {/* Labeled markers: p10 (left edge), median (center), p90 (right edge) */}
            <div className="relative mt-2.5" style={{ height: "44px" }}>
              {markers.map((m) => (
                <div
                  key={m.label}
                  className="absolute flex flex-col items-center"
                  style={{ left: norm(m.value), transform: "translateX(-50%)" }}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      m.accent ? "bg-green-600" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] mt-0.5 whitespace-nowrap ${
                      m.accent ? "text-green-700 font-semibold" : "text-slate-400"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-slate-600 whitespace-nowrap">
                    {fmt(m.value, 2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Axis — shows actual zoomed range, not 0–1 */}
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[9px] text-slate-400">{fmt(d.p10)}</span>
              <span className="font-mono text-[9px] text-slate-300">zoomed p10 → p90</span>
              <span className="font-mono text-[9px] text-slate-400">{fmt(d.p90)}</span>
            </div>
          </div>

          {/* IQR interpretation */}
          <p className="font-sans text-xs text-slate-400 mt-4 leading-relaxed">
            80% of pixels fall between{" "}
            <span className="font-mono text-slate-600">{fmt(d.p10)}</span> and{" "}
            <span className="font-mono text-slate-600">{fmt(d.p90)}</span>.
            The green band (IQR) shows the middle 50%, spanning{" "}
            <span className="font-mono text-slate-600">
              {fmt(d.p25)}–{fmt(d.p75)}
            </span>
            {" "}— {d.p75 - d.p25 < 0.15
              ? "a tight range, indicating consistent canopy density."
              : "a wider range, indicating notable variation across the field."}
          </p>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60">
        <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
          NDVI (Normalized Difference Vegetation Index) runs from −1 to 1.
          Values above <span className="font-mono text-slate-500">0.6</span> indicate
          active green vegetation. Concern zones are pixels below{" "}
          <span className="font-mono text-slate-500">0.2</span>.
        </p>
      </div>
    </div>
  );
}
