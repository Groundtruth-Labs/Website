import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectDetail } from "@/components/dashboard/ProjectDetail";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: data?.name ?? "Project",
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(`
      *,
      deliverables(*),
      reports(*)
    `)
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  // Normalize nested arrays (Supabase returns arrays for one-to-many)
  const deliverables = Array.isArray(project.deliverables)
    ? project.deliverables
    : project.deliverables
    ? [project.deliverables]
    : [];

  const reports = Array.isArray(project.reports)
    ? project.reports
    : project.reports
    ? [project.reports]
    : [];

  // Extract NDVI stats from the most recent NDVI deliverable (if any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ndviDeliverable = (deliverables as any[]).find(
    (d) => d.type === "ndvi" && d.ndvi_stats
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ndviStats = (ndviDeliverable?.ndvi_stats as any) ?? null;

  return (
    <ProjectDetail
      project={{
        id: project.id,
        name: project.name,
        type: project.type,
        status: project.status,
        location: project.location,
        started_at: project.started_at,
        deliverables,
        reports,
        ndviStats,
      }}
    />
  );
}
