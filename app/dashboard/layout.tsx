import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch client with projects and onboarding state
  const { data: client } = await supabase
    .from("clients")
    .select("company_name, is_admin, onboarded, projects(id, name, type, status)")
    .eq("user_id", user.id)
    .single();

  // Non-admin users who haven't completed setup go to onboarding
  if (!client?.is_admin && !client?.onboarded) {
    redirect("/onboarding");
  }

  const projects = client?.projects ?? [];
  // Supabase returns projects as an array when using select with relationships
  const projectList = Array.isArray(projects) ? projects : [projects].filter(Boolean);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DashboardSidebar
        projects={projectList as { id: string; name: string; type: string | null; status: string | null }[]}
        companyName={client?.company_name}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
