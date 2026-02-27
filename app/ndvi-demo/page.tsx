import { NdviStatsCard } from "@/components/dashboard/NdviStatsCard";

export default function NdviDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-1">
            Component preview
          </p>
          <h1 className="font-mono text-xl font-bold text-slate-900">
            NDVI Analytics Card
          </h1>
        </div>
        <NdviStatsCard capturedAt="2026-02-20T08:00:00Z" />
      </div>
    </div>
  );
}
