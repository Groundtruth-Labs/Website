import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Folder, Mail, Send } from "lucide-react";
import { resendInvite } from "./actions";
import { InviteClientDialog } from "@/components/admin/InviteClientDialog";

export const metadata: Metadata = { title: "Clients" };

const industryLabel: Record<string, { label: string; color: string }> = {
  agriculture: { label: "Agriculture", color: "bg-green-100 text-green-700" },
  construction: { label: "Construction", color: "bg-cyan-100 text-cyan-700" },
  solar: { label: "Solar", color: "bg-amber-100 text-amber-700" },
  golf: { label: "Golf", color: "bg-emerald-100 text-emerald-700" },
  other: { label: "Other", color: "bg-slate-100 text-slate-600" },
};

export default async function ClientsPage() {
  const supabase = await createClient();

  // Fetch all clients including onboarding status
  const { data: clients } = await supabase
    .from("clients")
    .select("id, contact_name, contact_email, company_name, industry, is_admin, onboarded")
    .order("company_name");

  // Fetch project counts for each client
  const { data: projectCounts } = await supabase
    .from("projects")
    .select("client_id, id");

  const projectMap: Record<string, number> = {};
  projectCounts?.forEach((p) => {
    projectMap[p.client_id] = (projectMap[p.client_id] ?? 0) + 1;
  });

  const pendingCount = clients?.filter((c) => !c.is_admin && !c.onboarded).length ?? 0;

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-slate-900">Clients</h1>
          <p className="font-sans text-sm text-slate-500 mt-0.5">
            Registered portal users and their projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded">
              <Send className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-sans text-xs text-amber-700 font-medium">
                {pendingCount} pending setup
              </span>
            </div>
          )}
          <InviteClientDialog />
        </div>
      </div>

      <div className="p-8">
        {!clients || clients.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded px-6 py-16 text-center">
            <p className="font-sans text-slate-400">No clients registered yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clients.map((c) => {
                  const ind = c.industry ? industryLabel[c.industry] : null;
                  const projCount = projectMap[c.id] ?? 0;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-sans text-sm font-medium text-slate-900">
                          {c.contact_name ?? "—"}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-300" />
                          <a
                            href={`mailto:${c.contact_email}`}
                            className="font-sans text-xs text-slate-400 hover:text-cyan-700 transition-colors"
                          >
                            {c.contact_email}
                          </a>
                        </div>
                        {c.company_name && (
                          <p className="font-sans text-xs text-slate-400 mt-0.5">
                            {c.company_name}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {ind ? (
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded ${ind.color}`}
                          >
                            {ind.label}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Folder className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-sm">{projCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {c.is_admin ? (
                          /* Admin badge — unchanged */
                          <span className="font-mono text-xs px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded">
                            admin
                          </span>
                        ) : c.onboarded ? (
                          /* Active client */
                          <span className="font-mono text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                            active
                          </span>
                        ) : (
                          /* Signed up but hasn't completed onboarding */
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-200">
                              pending setup
                            </span>
                            {c.contact_email && (
                              <form action={resendInvite}>
                                <input
                                  type="hidden"
                                  name="email"
                                  value={c.contact_email}
                                />
                                <button
                                  type="submit"
                                  title="Resend onboarding link"
                                  className="flex items-center gap-1 font-sans text-xs text-slate-400 hover:text-cyan-700 transition-colors"
                                >
                                  <Send className="w-3 h-3" />
                                  Resend
                                </button>
                              </form>
                            )}
                          </div>
                        )}
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
