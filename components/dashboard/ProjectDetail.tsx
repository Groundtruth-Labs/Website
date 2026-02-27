"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeliverableList } from "@/components/dashboard/DeliverableList";
import { ReportViewer } from "@/components/dashboard/ReportViewer";
import { NdviStatsCard } from "@/components/dashboard/NdviStatsCard";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar, CheckCircle2, Clock, Circle } from "lucide-react";
import { motion } from "motion/react";

interface Deliverable {
  id: string;
  name: string;
  type: string | null;
  file_url: string | null;
  captured_at: string | null;
}

interface Report {
  id: string;
  title: string;
  summary: string | null;
  recommendations: string | null;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NdviStats = any;

interface Project {
  id: string;
  name: string;
  type: string | null;
  status: string | null;
  location: string | null;
  started_at: string | null;
  deliverables: Deliverable[];
  reports: Report[];
  ndviStats?: NdviStats | null;
}

const statusSteps = [
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const typeColors: Record<string, string> = {
  agriculture: "bg-green-50 text-green-700 border-green-100",
  construction: "bg-cyan-50 text-cyan-700 border-cyan-100",
};

export function ProjectDetail({ project }: { project: Project }) {
  const currentStepIdx = statusSteps.findIndex(
    (s) => s.key === project.status
  );

  return (
    <div>
      {/* Project header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-2">
          <h1 className="font-mono text-2xl font-bold text-slate-900">
            {project.name}
          </h1>
          {project.type && (
            <span
              className={`inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-mono font-medium ${typeColors[project.type] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
            >
              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-sans text-slate-500">
          {project.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {project.location}
            </span>
          )}
          {project.started_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Started {formatDate(project.started_at)}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deliverables">
            Deliverables
            {project.deliverables.length > 0 && (
              <span className="ml-1.5 font-mono text-xs bg-slate-200 text-slate-600 rounded px-1.5 py-0.5">
                {project.deliverables.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {project.reports.length > 0 && (
              <span className="ml-1.5 font-mono text-xs bg-slate-200 text-slate-600 rounded px-1.5 py-0.5">
                {project.reports.length}
              </span>
            )}
          </TabsTrigger>
          {project.type === "agriculture" && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" asChild>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status timeline */}
            <div className="border border-slate-200 bg-white rounded p-6">
              <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                Project status
              </p>
              <div className="flex items-center gap-0">
                {statusSteps.map((step, i) => {
                  const isDone = i < currentStepIdx;
                  const isCurrent = i === currentStepIdx;
                  const isLast = i === statusSteps.length - 1;

                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            isDone
                              ? "bg-green-500 border-green-500"
                              : isCurrent
                              ? "bg-cyan-700 border-cyan-700"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : isCurrent ? (
                            <Clock className="w-4 h-4 text-white" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <span
                          className={`font-mono text-xs mt-2 ${
                            isCurrent ? "text-cyan-700 font-semibold" : isDone ? "text-green-600" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {!isLast && (
                        <div
                          className={`flex-1 h-0.5 mx-1 mt-[-20px] ${
                            i < currentStepIdx ? "bg-green-400" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary counts */}
            <div className="border border-slate-200 bg-white rounded p-6">
              <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                Summary
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded p-4">
                  <div className="font-mono text-3xl font-bold text-slate-900">
                    {project.deliverables.length}
                  </div>
                  <div className="font-sans text-xs text-slate-500 mt-1 uppercase tracking-wide">
                    Deliverables
                  </div>
                </div>
                <div className="bg-slate-50 rounded p-4">
                  <div className="font-mono text-3xl font-bold text-slate-900">
                    {project.reports.length}
                  </div>
                  <div className="font-sans text-xs text-slate-500 mt-1 uppercase tracking-wide">
                    Reports
                  </div>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Deliverables */}
        <TabsContent value="deliverables" asChild>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DeliverableList deliverables={project.deliverables} />
          </motion.div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" asChild>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ReportViewer reports={project.reports} />
          </motion.div>
        </TabsContent>

        {/* Analytics — NDVI (agriculture projects only) */}
        {project.type === "agriculture" && (
          <TabsContent value="analytics" asChild>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    Most recent NDVI flight
                  </p>
                  <p className="font-sans text-xs text-slate-500">
                    Statistics are computed from the processed multispectral output. Each flight produces one result set.
                  </p>
                </div>
                <NdviStatsCard
                  stats={project.ndviStats ?? undefined}
                  capturedAt={
                    project.deliverables.find((d) => d.type === "ndvi")
                      ?.captured_at ?? null
                  }
                />
              </div>
            </motion.div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
