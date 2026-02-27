"use client";

import { useState, useCallback, useRef } from "react";

function fmtDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
}

export default function InteractiveChart({
  data,
  color,
  gradId,
  days,
}: {
  data: number[];
  color: string;
  gradId: string;
  days: string[];
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 500;
  const H = 120;
  const P = { t: 12, r: 8, b: 30, l: 32 };
  const cW = W - P.l - P.r;
  const cH = H - P.t - P.b;
  const n = data.length;
  const maxVal = Math.max(...data, 4);

  const gx = (i: number) => P.l + (i / (n - 1)) * cW;
  const gy = (v: number) => P.t + (1 - v / maxVal) * cH;

  const pts = data.map((v, i) => ({ x: gx(i), y: gy(v), val: v }));

  // Build smooth curve path
  let lineD = "";
  pts.forEach((p, i) => {
    if (i === 0) {
      lineD += `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    } else {
      const prev = pts[i - 1];
      const cpx1 = (prev.x + (p.x - prev.x) * 0.4).toFixed(1);
      const cpx2 = (p.x - (p.x - prev.x) * 0.4).toFixed(1);
      lineD += ` C ${cpx1} ${prev.y.toFixed(1)} ${cpx2} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
  });

  const baseY = (P.t + cH).toFixed(1);
  const areaD =
    lineD +
    ` L ${gx(n - 1).toFixed(1)} ${baseY} L ${gx(0).toFixed(1)} ${baseY} Z`;

  const yLabels = Array.from(new Set([0, Math.round(maxVal / 2), maxVal]));
  const xIdxs = Array.from(
    new Set([
      0,
      Math.round(n * 0.25),
      Math.round(n * 0.5),
      Math.round(n * 0.75),
      n - 1,
    ])
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      // Map mouse position to SVG coordinate space
      const mouseX = ((e.clientX - rect.left) / rect.width) * W;
      // Find nearest data point index
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < n; i++) {
        const dist = Math.abs(gx(i) - mouseX);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      // Only show tooltip if mouse is within the chart area
      if (mouseX >= P.l - 10 && mouseX <= W - P.r + 10) {
        setHoverIdx(closest);
      } else {
        setHoverIdx(null);
      }
    },
    [n, W, P.l, P.r]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIdx(null);
  }, []);

  // Tooltip position logic
  const hoveredPt = hoverIdx !== null ? pts[hoverIdx] : null;
  const tooltipW = 90;
  const tooltipH = 38;
  let tooltipX = hoveredPt ? hoveredPt.x - tooltipW / 2 : 0;
  if (tooltipX < P.l) tooltipX = P.l;
  if (tooltipX + tooltipW > W - P.r) tooltipX = W - P.r - tooltipW;
  const tooltipY = hoveredPt
    ? hoveredPt.y - tooltipH - 10 < 0
      ? hoveredPt.y + 12
      : hoveredPt.y - tooltipH - 10
    : 0;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      className="overflow-visible cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`${gradId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* horizontal grid lines */}
      {yLabels.map((v) => (
        <line
          key={v}
          x1={P.l}
          y1={gy(v).toFixed(1)}
          x2={W - P.r}
          y2={gy(v).toFixed(1)}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* area fill */}
      <path d={areaD} fill={`url(#${gradId})`} />

      {/* line */}
      <path
        d={lineD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* data points on last 3 days (subtle, always visible) */}
      {pts.slice(-3).map((p, i) => (
        <circle
          key={`static-${i}`}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r="2.5"
          fill={color}
          opacity={hoverIdx !== null && hoverIdx === n - 3 + i ? 0 : 1}
        />
      ))}

      {/* y-axis labels */}
      {yLabels.map((v) => (
        <text
          key={v}
          x={P.l - 6}
          y={gy(v).toFixed(1)}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="9"
          fill="#94a3b8"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {v}
        </text>
      ))}

      {/* x-axis labels */}
      {xIdxs.map((i) => (
        <text
          key={i}
          x={gx(i).toFixed(1)}
          y={H - 4}
          textAnchor="middle"
          fontSize="9"
          fill="#94a3b8"
          fontFamily="var(--font-geist-sans), sans-serif"
        >
          {fmtDate(days[i])}
        </text>
      ))}

      {/* baseline */}
      <line
        x1={P.l}
        y1={(P.t + cH).toFixed(1)}
        x2={W - P.r}
        y2={(P.t + cH).toFixed(1)}
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Hover elements */}
      {hoveredPt && hoverIdx !== null && (
        <>
          {/* Vertical reference line */}
          <line
            x1={hoveredPt.x}
            y1={P.t}
            x2={hoveredPt.x}
            y2={P.t + cH}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />

          {/* Highlighted dot */}
          <circle
            cx={hoveredPt.x}
            cy={hoveredPt.y}
            r="4"
            fill="white"
            stroke={color}
            strokeWidth="2"
          />

          {/* Tooltip background */}
          <rect
            x={tooltipX}
            y={tooltipY}
            width={tooltipW}
            height={tooltipH}
            rx="4"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
            filter={`url(#${gradId}-shadow)`}
          />

          {/* Tooltip date */}
          <text
            x={tooltipX + tooltipW / 2}
            y={tooltipY + 14}
            textAnchor="middle"
            fontSize="9"
            fill="#94a3b8"
            fontFamily="var(--font-geist-sans), sans-serif"
          >
            {fmtDate(days[hoverIdx])}
          </text>

          {/* Tooltip value */}
          <text
            x={tooltipX + tooltipW / 2}
            y={tooltipY + 29}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill={color}
            fontFamily="var(--font-geist-mono), monospace"
          >
            {hoveredPt.val}
          </text>
        </>
      )}
    </svg>
  );
}
