"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";

const nodes: Node[] = [
  {
    id: "1",
    type: "input",
    position: { x: 0, y: 80 },
    data: { label: "Client" },
    style: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "0.25rem",
      padding: "10px 16px",
      fontSize: "12px",
      fontFamily: "var(--font-geist-mono)",
      fontWeight: 600,
      color: "#0f172a",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      minWidth: 120,
    },
  },
  {
    id: "2",
    position: { x: 180, y: 80 },
    data: { label: "Groundtruth Labs" },
    style: {
      background: "#ecfeff",
      border: "2px solid #0e7490",
      borderRadius: "0.25rem",
      padding: "10px 16px",
      fontSize: "12px",
      fontFamily: "var(--font-geist-mono)",
      fontWeight: 700,
      color: "#0e7490",
      boxShadow: "0 0 0 3px rgba(14, 116, 144, 0.08)",
      minWidth: 160,
    },
  },
  {
    id: "3",
    position: { x: 390, y: 0 },
    data: { label: "Licensed Drone Partner" },
    style: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "0.25rem",
      padding: "10px 16px",
      fontSize: "12px",
      fontFamily: "var(--font-geist-mono)",
      fontWeight: 600,
      color: "#475569",
      minWidth: 180,
    },
  },
  {
    id: "4",
    position: { x: 390, y: 160 },
    data: { label: "Analysis + Processing" },
    style: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "0.25rem",
      padding: "10px 16px",
      fontSize: "12px",
      fontFamily: "var(--font-geist-mono)",
      fontWeight: 600,
      color: "#475569",
      minWidth: 180,
    },
  },
  {
    id: "5",
    type: "output",
    position: { x: 620, y: 80 },
    data: { label: "Dashboard + Report" },
    style: {
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "0.25rem",
      padding: "10px 16px",
      fontSize: "12px",
      fontFamily: "var(--font-geist-mono)",
      fontWeight: 700,
      color: "#15803d",
      minWidth: 160,
    },
  },
];

const edges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    type: "smoothstep",
    style: { stroke: "#0e7490", strokeWidth: 1.5 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    type: "smoothstep",
    style: { stroke: "#94a3b8", strokeWidth: 1.5 },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    animated: true,
    type: "smoothstep",
    style: { stroke: "#94a3b8", strokeWidth: 1.5 },
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    animated: true,
    type: "smoothstep",
    style: { stroke: "#22c55e", strokeWidth: 1.5 },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    type: "smoothstep",
    style: { stroke: "#22c55e", strokeWidth: 1.5 },
  },
];

export function HowItWorks() {
  const onInit = useCallback(() => {}, []);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
            Our process
          </span>
          <h2 className="font-mono text-4xl font-bold text-slate-900 mt-3">
            How it works.
          </h2>
          <p className="font-sans text-slate-600 mt-4 max-w-xl text-lg">
            You tell us what you need. We coordinate the flight, process the
            imagery, and send you a report, typically within 48 hours of
            capture.
          </p>
        </motion.div>

        {/* ReactFlow diagram */}
        <div
          className="border border-slate-200 bg-white rounded shadow-sm overflow-hidden"
          style={{ height: 280 }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onInit={onInit}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1.5}
              color="#cbd5e1"
            />
          </ReactFlow>
        </div>

        {/* Steps description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              step: "01",
              title: "Discovery call",
              desc: "We scope your project, identify what data you need, and schedule a flight with a licensed local partner.",
            },
            {
              step: "02",
              title: "Capture + analysis",
              desc: "The drone goes up. Raw imagery gets processed into orthomosaics, NDVI maps, and change detection outputs.",
            },
            {
              step: "03",
              title: "Insights delivered",
              desc: "Your report and dashboard are ready within 48 hours. Clear findings, specific next steps.",
            },
          ].map(({ step, title, desc }, i) => (
            <motion.div
              suppressHydrationWarning
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              className="flex gap-4"
            >
              <span className="font-mono text-2xl font-bold text-slate-200 leading-none mt-0.5">
                {step}
              </span>
              <div>
                <h3 className="font-mono text-sm font-semibold text-slate-900 mb-1">
                  {title}
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
