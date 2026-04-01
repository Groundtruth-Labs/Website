'use client';

import { useRef, useEffect, useCallback } from 'react';
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
  type MotionValue,
} from 'motion/react';
import { useUiStore } from '@/lib/store/uiStore';

// ─── Data ──────────────────────────────────────────────────────────────────

const FRAME_COUNT = 145;
const FRAME_SPEED = 1.0;

const PANELS = [
  {
    id: 1,
    label: '01 / CAPTURE',
    heading: 'Your fields from above',
    body: 'Licensed FAA-compliant drone partners fly your site and capture high-resolution aerial imagery. Orchards, row crops, construction sites, solar arrays.',
    enterAt: 0,
    peakStart: 0.05,
    peakEnd: 0.28,
    exitAt: 0.36,
  },
  {
    id: 2,
    label: '02 / ANALYZE',
    heading: 'NDVI intelligence layer',
    body: 'Our algorithms parse every pixel, mapping vegetation health gradients, flagging stress zones, and surfacing anomalies invisible to the naked eye.',
    enterAt: 0.3,
    peakStart: 0.38,
    peakEnd: 0.6,
    exitAt: 0.68,
  },
  {
    id: 3,
    label: '03 / DELIVER',
    heading: 'Insights in 48 hours',
    body: 'Annotated maps, field health scores, and prioritized recommendations. Ready before your next irrigation cycle or site walkthrough.',
    enterAt: 0.62,
    peakStart: 0.70,
    peakEnd: 0.92,
    exitAt: 1.0,
  },
];

// ─── Word-reveal sub-component ─────────────────────────────────────────────

interface WordRevealProps {
  word: string;
  scrollYProgress: MotionValue<number>;
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
  wordIndex: number;
  totalWords: number;
  reverseExit?: boolean;
}

function WordReveal({
  word,
  scrollYProgress,
  enterStart,
  enterEnd,
  exitStart,
  exitEnd,
  wordIndex,
  totalWords,
  reverseExit = true,
}: WordRevealProps) {
  const fwd = totalWords > 1 ? wordIndex / (totalWords - 1) : 0;
  const bwd = reverseExit ? 1 - fwd : fwd;

  const eRange = enterEnd - enterStart;
  const ws = enterStart + fwd * eRange * 0.6;
  const we = Math.min(ws + eRange * 0.5, enterEnd + eRange * 0.05);

  const xRange = exitEnd - exitStart;
  const xs = exitStart + bwd * xRange * 0.6;
  const xe = Math.min(xs + xRange * 0.5, exitEnd);

  const opacity = useTransform(scrollYProgress, [ws, we, xs, xe], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [ws, we], [10, 0]);

  return (
    <motion.span style={{ opacity, y, display: 'inline-block' }} className="mr-[0.22em]">
      {word}
    </motion.span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function DroneSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const currentFrameRef = useRef(0);
  const bgColorRef = useRef<string>('#e8e8e8');
  const rafRef = useRef<number | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Draw ──────────────────────────────────────────────────────────────────

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    // Contain + slight scale so cube breathes within the panel
    const scale = Math.min(cw / iw, ch / ih) * 0.92;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.fillStyle = bgColorRef.current;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ── Background colour sampling ────────────────────────────────────────────

  const sampleBgFromImage = useCallback((img: HTMLImageElement) => {
    try {
      const tmp = document.createElement('canvas');
      tmp.width = 4; tmp.height = 4;
      const tCtx = tmp.getContext('2d');
      if (!tCtx) return;
      tCtx.drawImage(img, 0, 0, img.naturalWidth * 0.02, img.naturalHeight * 0.02, 0, 0, 4, 4);
      const d = tCtx.getImageData(1, 1, 1, 1).data;
      const colour = `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
      bgColorRef.current = colour;
      if (canvasContainerRef.current) canvasContainerRef.current.style.backgroundColor = colour;
      // sticky stays white; gradient stays white → transparent
    } catch { /* tainted canvas — use default */ }
  }, []);

  // ── HiDPI resize ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  // ── Frame preloader (two-phase) ───────────────────────────────────────────

  useEffect(() => {
    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    framesRef.current = frames;
    loadedRef.current = loaded;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => { loaded[i] = true; frames[i] = img; resolve(); };
        img.onerror = () => resolve();
        img.src = `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`;
        frames[i] = img;
      });

    // Phase 1: first 10 frames → first paint
    Promise.all(Array.from({ length: 10 }, (_, i) => load(i))).then(() => {
      sampleBgFromImage(frames[0]);
      drawFrame(0);
      // Phase 2: rest in background
      for (let i = 10; i < FRAME_COUNT; i++) load(i);
    });
  }, [drawFrame, sampleBgFromImage]);

  // ── Scroll → frame ────────────────────────────────────────────────────────

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const accelerated = Math.min(progress * FRAME_SPEED, 1);
    const index = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
    currentFrameRef.current = index;
    // Cancel any pending draw and schedule a fresh one — prevents stacked rAF calls
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(index));
  });

  // ── Section fade in/out at entry and exit ─────────────────────────────────
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.90, 1.0],
    [0, 1, 1, 0]
  );

  // ── Label / divider opacities ─────────────────────────────────────────────
  // Each label waits until the *previous* panel has fully exited before appearing.
  const lbl1 = useTransform(scrollYProgress,
    [PANELS[0].enterAt, PANELS[0].peakStart, PANELS[0].peakEnd, PANELS[0].exitAt], [0, 1, 1, 0]);
  const lbl2 = useTransform(scrollYProgress,
    [PANELS[0].exitAt, PANELS[1].peakStart, PANELS[1].peakEnd, PANELS[1].exitAt], [0, 1, 1, 0]);
  const lbl3 = useTransform(scrollYProgress,
    [PANELS[1].exitAt, PANELS[2].peakStart, PANELS[2].peakEnd, PANELS[2].exitAt], [0, 1, 1, 0]);
  const labelOpacities = [lbl1, lbl2, lbl3];

  // ── Panel Y slides — enter from below, exit upward ────────────────────────
  const py1 = useTransform(scrollYProgress,
    [PANELS[0].enterAt, PANELS[0].peakStart, PANELS[0].peakEnd, PANELS[0].exitAt], [60, 0, 0, -60]);
  const py2 = useTransform(scrollYProgress,
    [PANELS[1].enterAt, PANELS[1].peakStart, PANELS[1].peakEnd, PANELS[1].exitAt], [60, 0, 0, -60]);
  const py3 = useTransform(scrollYProgress,
    [PANELS[2].enterAt, PANELS[2].peakStart, PANELS[2].peakEnd, PANELS[2].exitAt], [60, 0, 0, -60]);
  const panelYOffsets = [py1, py2, py3];

  // ── Progress rail ─────────────────────────────────────────────────────────
  const rail1Height = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%']);
  const rail2Height = useTransform(scrollYProgress, [0.5, 1], ['0%', '100%']);
  const dot1Opacity = useTransform(scrollYProgress, [0, 0.1], [0.3, 1]);
  const dot2Opacity = useTransform(scrollYProgress, [0.3, 0.42], [0.3, 1]);
  const dot3Opacity = useTransform(scrollYProgress, [0.62, 0.72], [0.3, 1]);

  // ── Scroll hint ───────────────────────────────────────────────────────────
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // ── Navbar fade ───────────────────────────────────────────────────────────
  const setDroneActive = useUiStore((s) => s.setDroneActive);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setDroneActive(p > 0.02 && p < 0.98);
  });

  return (
    <section
      ref={containerRef}
      aria-label="How Groundtruth Labs works"
      style={{ height: '750vh' }}
      className="relative"
    >
      {/* Sticky viewport — left side is white; canvas side is grey (video bg) */}
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden bg-white">

        {/* ── Fade wrapper: entire section content fades in and out ─────── */}
        <motion.div style={{ opacity: sectionOpacity }} className="absolute inset-0">

          {/* ── Right canvas panel ──────────────────────────────────────── */}
          <div
            ref={canvasContainerRef}
            className="absolute right-0 top-0 h-full overflow-hidden"
            style={{ width: '62vw', backgroundColor: '#e8e8e8' }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            />
            {/* Left-edge gradient — blends canvas into white left side */}
            <div
              ref={gradientRef}
              className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to right, white, transparent)',
              }}
            />
          </div>

          {/* ── Left text panels ─────────────────────────────────────────── */}
          {PANELS.map((panel, i) => {
            const headingWords = panel.heading.split(' ');
            const bodyWords = panel.body.split(' ');
            const bodyEnterStart = panel.peakStart * 0.6 + panel.enterAt * 0.4;
            const bodyEnterEnd = panel.peakStart + (panel.peakEnd - panel.peakStart) * 0.12;

            return (
              <motion.div
                key={panel.id}
                className="absolute z-20 select-none pointer-events-none"
                style={{ left: '6vw', width: '28vw', top: '50%', translateY: '-50%', y: panelYOffsets[i] }}
              >
                {/* Label */}
                <motion.span
                  style={{ opacity: labelOpacities[i] }}
                  className="block text-[0.6rem] font-mono uppercase tracking-[0.18em] text-cyan-700"
                >
                  {panel.label}
                </motion.span>

                {/* Accent line */}
                <motion.div
                  style={{ opacity: labelOpacities[i] }}
                  className="mt-2 mb-3 h-px w-8 bg-cyan-700/50"
                />

                {/* Heading — word by word */}
                <h2 className="font-mono text-[1.75rem] font-bold leading-[1.25] text-slate-900">
                  {headingWords.map((word, wi) => (
                    <WordReveal
                      key={wi}
                      word={word}
                      scrollYProgress={scrollYProgress}
                      enterStart={panel.enterAt}
                      enterEnd={panel.peakStart}
                      exitStart={panel.peakEnd}
                      exitEnd={panel.exitAt}
                      wordIndex={wi}
                      totalWords={headingWords.length}
                    />
                  ))}
                </h2>

                {/* Body — word by word */}
                <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-500">
                  {bodyWords.map((word, wi) => (
                    <WordReveal
                      key={wi}
                      word={word}
                      scrollYProgress={scrollYProgress}
                      enterStart={bodyEnterStart}
                      enterEnd={bodyEnterEnd}
                      exitStart={panel.peakEnd}
                      exitEnd={panel.exitAt}
                      wordIndex={wi}
                      totalWords={bodyWords.length}
                    />
                  ))}
                </p>
              </motion.div>
            );
          })}

          {/* ── Progress rail — right edge ───────────────────────────────── */}
          <div
            aria-hidden="true"
            className="absolute right-5 top-1/2 z-20 flex flex-col items-center"
            style={{ transform: 'translateY(-50%)' }}
          >
            <motion.div style={{ opacity: dot1Opacity }} className="w-1.5 h-1.5 rounded-full bg-slate-400 mb-1" />
            <div className="relative w-px bg-slate-300/60" style={{ height: 40 }}>
              <motion.div className="absolute top-0 left-0 w-full bg-slate-500" style={{ height: rail1Height }} />
            </div>
            <motion.div style={{ opacity: dot2Opacity }} className="w-1.5 h-1.5 rounded-full bg-slate-400 my-1" />
            <div className="relative w-px bg-slate-300/60" style={{ height: 40 }}>
              <motion.div className="absolute top-0 left-0 w-full bg-slate-500" style={{ height: rail2Height }} />
            </div>
            <motion.div style={{ opacity: dot3Opacity }} className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1" />
          </div>

          {/* ── Scroll hint — bottom center ───────────────────────────────── */}
          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none select-none"
          >
            <span className="text-[0.58rem] font-mono uppercase tracking-[0.18em] text-slate-400">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-px h-5 bg-gradient-to-b from-slate-300 to-transparent"
            />
          </motion.div>

          {/* ── Corner label ─────────────────────────────────────────────── */}
          <div
            aria-hidden="true"
            className="absolute top-5 right-[calc(1.25rem+14px)] z-20 pointer-events-none select-none"
          >
            <span className="text-[0.58rem] font-mono uppercase tracking-[0.18em] text-slate-400">
              The process
            </span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
