import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DeliverableType =
  | "ndvi"
  | "orthomosaic"
  | "change_detection"
  | "report"
  | "site_progress"
  | "figure";

export function getDeliverableStyle(type: string): {
  label: string;
  color: string;
} {
  const map: Record<string, { label: string; color: string }> = {
    ndvi: {
      label: "NDVI",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    orthomosaic: {
      label: "Orthomosaic",
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    },
    change_detection: {
      label: "Change Detection",
      color: "bg-slate-100 text-slate-700 border-slate-200",
    },
    report: {
      label: "Report",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    site_progress: {
      label: "Site Progress",
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    },
    figure: {
      label: "Figure",
      color: "bg-violet-100 text-violet-700 border-violet-200",
    },
  };
  return (
    map[type] ?? { label: type, color: "bg-slate-100 text-slate-600 border-slate-200" }
  );
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export type ProjectStatus = "active" | "completed" | "pending";
export type Industry = "agriculture" | "construction" | "solar" | "golf";
