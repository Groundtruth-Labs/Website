"use client";

import { useState, useEffect } from "react";
import { FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectCardSkeleton } from "@/components/dashboard/ProjectCardSkeleton";

type Project = {
  id: string;
  name: string;
  type: string | null;
  status: string | null;
  location: string | null;
  started_at: string | null;
};

interface DashboardViewProps {
  projects: Project[];
  greeting: string;
}

export function DashboardView({ projects, greeting }: DashboardViewProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-slate-900">
          {greeting}
        </h1>
        <p className="font-sans text-sm text-slate-500 mt-1">
          Your project dashboard. All deliverables and reports in one place.
        </p>
      </div>

      {/* Projects */}
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-3 w-24 bg-slate-200 animate-pulse rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {projects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-200 rounded bg-white">
                <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h2 className="font-mono text-base font-semibold text-slate-900 mb-2">
                  Your first project is on the way.
                </h2>
                <p className="font-sans text-sm text-slate-500 max-w-xs mx-auto mb-6">
                  Once your pilot project is set up, it will appear here with all
                  deliverables and reports.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/book">Book a discovery call</a>
                </Button>
              </div>
            ) : (
              <>
                <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  Projects ({projects.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
