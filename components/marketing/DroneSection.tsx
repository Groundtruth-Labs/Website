'use client';

import { useRef, useEffect, useCallback } from 'react';
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
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
  },
  {
    id: 2,
    label: '02 / ANALYZE',
    heading: 'NDVI intelligence layer',
    body: 'Our algorithms parse every pixel, mapping vegetation health gradients, flagging stress zones, and surfacing anomalies invisible to the naked eye.',
  },
  {
    id: 3,
    label: '03 / DELIVER',
    heading: 'Insights in 48 hours',
    body: 'Annotated maps, field health scores, and prioritized recommendations. Ready before your next irrigation cycle or site walkthrough.',
  },
];

// ─── Main component ────────────────────────────────────────────────────────

export function DroneSection() {
  const containerRef     = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const framesRef        = useRef<HTMLImageElement[]>([]);
  const loadedRef        = useRef<boolean[]>([]);
  const currentFrameRef  = useRef(0);
  const bgColorRef       = useRef<string>('#e2e4e1');
  const rafRef           = useRef<number | null>(null);
  const stickyRef        = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Draw ──────────────────────────────────────────────────────────────────

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img    = framesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return;
    const scale = Math.min(cw / iw, ch / ih) * 0.92;
    const dw = iw * scale, dh = ih * scale;
    const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
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
      bgColorRef.current = `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
      if (canvasContainerRef.current) canvasContainerRef.current.style.backgroundColor = bgColorRef.current;
    } catch { /* tainted canvas */ }
  }, []);

  // ── HiDPI resize ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
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
    const loaded: boolean[]          = new Array(FRAME_COUNT).fill(false);
    framesRef.current = frames;
    loadedRef.current = loaded;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload  = () => { loaded[i] = true; frames[i] = img; resolve(); };
        img.onerror = () => resolve();
        img.src = `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`;
        frames[i] = img;
      });
    Promise.all(Array.from({ length: 10 }, (_, i) => load(i))).then(() => {
      sampleBgFromImage(frames[0]);
      drawFrame(0);
      for (let i = 10; i < FRAME_COUNT; i++) load(i);
    });
  }, [drawFrame, sampleBgFromImage]);

  // ── Scroll → frame ────────────────────────────────────────────────────────

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const accelerated = Math.min(progress * FRAME_SPEED, 1);
    const index = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
    currentFrameRef.current = index;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(index));
  });

  // ── Section fade ──────────────────────────────────────────────────────────

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.90, 1.0],
    [0,  1,    1,   0],
  );

  // ── Stacked reveal transforms ─────────────────────────────────────────────
  //
  // Each panel has three phases:
  //   ENTER  — flies up from below + flips in with rotateX, opacity 0 → 1
  //   PEAK   — featured at its final slot position, full scale, body visible
  //   SETTLE — compacts to a smaller scale and dims, body fades out
  //            (panel stays at slot position forever — no more Y movement)
  //
  // Final state: all 3 stacked at −30vh / 0vh / +30vh from viewport center.
  // The "slot" Y positions are baked into the SETTLE endpoint of each panel's
  // y transform; Framer Motion clamps to the last keyframe value after it.

  // ── Panel 0 (slot: −30 vh) ────────────────────────────────────────────────
  // enter 0.06–0.18 | peak 0.18–0.30 | settle 0.30–0.42
  const y0   = useTransform(scrollYProgress, [0.06, 0.18], ['10vh',  '-30vh']);
  const rx0  = useTransform(scrollYProgress, [0.06, 0.18], [14, 0]);
  const op0  = useTransform(scrollYProgress, [0.06, 0.15, 0.30, 0.42], [0, 1, 1, 0.70]);
  const sc0  = useTransform(scrollYProgress, [0.30, 0.42], [1, 0.82]);
  const bop0 = useTransform(scrollYProgress, [0.30, 0.40], [1, 0.45]);

  // ── Panel 1 (slot: 0 vh — stays at center) ───────────────────────────────
  // enter 0.30–0.42 | peak 0.42–0.62 | settle 0.62–0.72
  const y1   = useTransform(scrollYProgress, [0.30, 0.42], ['42vh', '0vh']);
  const rx1  = useTransform(scrollYProgress, [0.30, 0.42], [14, 0]);
  const op1  = useTransform(scrollYProgress, [0.30, 0.40, 0.62, 0.72], [0, 1, 1, 0.70]);
  const sc1  = useTransform(scrollYProgress, [0.62, 0.72], [1, 0.82]);
  const bop1 = useTransform(scrollYProgress, [0.62, 0.70], [1, 0.45]);

  // ── Panel 2 (slot: +30 vh) ────────────────────────────────────────────────
  // enter 0.62–0.74 | peak 0.74–0.92 | settle 0.92–1.0
  const y2   = useTransform(scrollYProgress, [0.62, 0.74], ['72vh', '30vh']);
  const rx2  = useTransform(scrollYProgress, [0.62, 0.74], [14, 0]);
  const op2  = useTransform(scrollYProgress, [0.62, 0.72, 0.92, 1.0], [0, 1, 1, 0.70]);
  const sc2  = useTransform(scrollYProgress, [0.92, 1.0], [1, 0.82]);
  const bop2 = useTransform(scrollYProgress, [0.92, 1.0], [1, 0.45]);

  const panelY   = [y0,   y1,   y2];
  const panelRx  = [rx0,  rx1,  rx2];
  const panelOp  = [op0,  op1,  op2];
  const panelSc  = [sc0,  sc1,  sc2];
  const panelBOp = [bop0, bop1, bop2];

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
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden bg-white">
        <motion.div style={{ opacity: sectionOpacity }} className="absolute inset-0">

          {/* ── Right canvas panel ──────────────────────────────────────────── */}
          <div
            ref={canvasContainerRef}
            className="absolute right-0 top-0 h-full overflow-hidden"
            style={{ width: '62vw', backgroundColor: '#e2e4e1' }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            />
            <div
              className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to right, white, transparent)' }}
            />
          </div>

          {/* ── Left stacked panels ─────────────────────────────────────────── */}
          {/* Perspective on the container so rotateX children get depth. */}
          <div
            className="absolute z-20 select-none pointer-events-none"
            style={{
              left: '6vw',
              width: '28vw',
              top: 0,
              bottom: 0,
              perspective: '900px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {PANELS.map((panel, i) => (
              <motion.div
                key={panel.id}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  translateY: '-50%',
                  y: panelY[i],
                  rotateX: panelRx[i],
                  opacity: panelOp[i],
                  scale: panelSc[i],
                  transformOrigin: '50% 50%',
                }}
              >
                <span className="block text-[0.6rem] font-mono uppercase tracking-[0.18em] text-cyan-700">
                  {panel.label}
                </span>
                <div className="mt-2 mb-3 h-px w-8 bg-cyan-700/50" />
                <h2 className="font-mono text-[1.75rem] font-bold leading-[1.25] text-slate-900">
                  {panel.heading}
                </h2>
                <motion.p
                  style={{ opacity: panelBOp[i] }}
                  className="mt-3 text-[0.82rem] leading-relaxed text-slate-500"
                >
                  {panel.body}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* ── Progress rail — right edge ──────────────────────────────────── */}
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
