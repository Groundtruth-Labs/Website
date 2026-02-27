import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Folder, MapPin, Leaf, HardHat } from "lucide-react";
import { NdviUploadForm } from "@/components/admin/NdviUploadForm";
import { FiguresUploadForm } from "@/components/admin/FiguresUploadForm";
import { NotifyClientButton } from "@/components/admin/NotifyClientButton";
import { CreateProjectForm } from "@/components/admin/CreateProjectForm";

export const metadata: Metadata = { title: "Projects" };

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-slate-100 text-slate-600",
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
};

export default async function ProjectsPage() {
  // Use service role to bypass RLS — admin needs to see all clients and projects
  const supabase = createAdminClient();

  // Fetch all projects with client info and NDVI deliverable presence
  const { data: projects } = await supabase
    .from("projects")
    .select(
      `id, name, type, status, location, started_at,
       clients(id, company_name, contact_name, contact_email),
       deliverables(id, type, ndvi_stats, captured_at)`
    )
    .order("created_at", { ascending: false });

  // Clients for the "new project" form — include everyone (admins, pending setup, etc.)
  const { data: clients } = await supabase
    .from("clients")
    .select("id, company_name, contact_name, contact_email, is_admin")
    .order("company_name");

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-slate-900">Projects</h1>
          <p className="font-sans text-sm text-slate-500 mt-0.5">
            Manage client projects and upload NDVI analytics results.
          </p>
        </div>
        <CreateProjectForm clients={clients ?? []} />
      </div>

      <div className="p-8">
        {!projects || projects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded px-6 py-16 text-center">
            <Folder className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="font-sans text-slate-400">No projects yet.</p>
            <p className="font-sans text-xs text-slate-400 mt-1">
              Create a project using the button above, then upload NDVI stats.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map((p) => {
                  const client = Array.isArray(p.clients) ? p.clients[0] : p.clients;
                  const deliverables = Array.isArray(p.deliverables) ? p.deliverables : [];
                  const ndviDeliverable = deliverables.find((d) => d.type === "ndvi");
                  const hasNdvi = !!ndviDeliverable?.ndvi_stats;
                  const figureCount = deliverables.filter((d) => d.type === "figure").length;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors align-top">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          {p.type === "agriculture" ? (
                            <Leaf className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <HardHat className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                          )}
                          <span className="font-sans text-sm font-medium text-slate-900">
                            {p.name}
                          </span>
                        </div>
                        {p.location && (
                          <div className="flex items-center gap-1 ml-5">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            <span className="font-sans text-xs text-slate-400">
                              {p.location}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-sm text-slate-700">
                          {client?.company_name ?? client?.contact_name ?? (
                            <span className="text-slate-400 text-xs font-mono">
                              {(client as { contact_email?: string | null })?.contact_email ?? "—"}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.status && (
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded ${statusColors[p.status] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {p.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {p.type === "agriculture" && (
                            <NdviUploadForm projectId={p.id} hasExisting={hasNdvi} />
                          )}
                          <FiguresUploadForm projectId={p.id} figureCount={figureCount} />
                          {client?.contact_email && (
                            <NotifyClientButton
                              clientEmail={client.contact_email}
                              clientName={client.company_name || client.contact_name || "Client"}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
