"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/ProjectCard";

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
            <Link href="/book">Book a discovery call</Link>
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
    </div>
  );
}
