import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    type: string | null;
    status: string | null;
    location: string | null;
    started_at: string | null;
  };
}

const statusConfig: Record<string, { label: string; variant: "success" | "default" | "muted" }> = {
  active: { label: "Active", variant: "success" },
  completed: { label: "Completed", variant: "muted" },
  pending: { label: "Pending", variant: "default" },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  agriculture: { label: "Agriculture", color: "bg-green-50 text-green-700 border-green-100" },
  construction: { label: "Construction", color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status ?? "pending"] ?? statusConfig.pending;
  const type = typeConfig[project.type ?? ""] ?? { label: project.type ?? "-", color: "bg-slate-50 text-slate-600 border-slate-200" };

  return (
    <Link href={`/dashboard/projects/${project.id}`} className="group block">
      <div className="border border-slate-200 bg-white rounded p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-sm font-semibold text-slate-900 truncate group-hover:text-cyan-700 transition-colors">
              {project.name}
            </h3>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${type.color}`}
          >
            {type.label}
          </span>
        </div>

        <div className="space-y-1.5">
          {project.location && (
            <div className="flex items-center gap-1.5 text-xs font-sans text-slate-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{project.location}</span>
            </div>
          )}
          {project.started_at && (
            <div className="text-xs font-sans text-slate-400">
              Started {formatDate(project.started_at)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mt-4 text-xs font-mono text-cyan-700 group-hover:gap-2 transition-all">
          View project
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
