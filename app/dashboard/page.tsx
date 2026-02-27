import { createClient } from "@/lib/supabase/server";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("company_name, contact_name, projects(*)")
    .eq("user_id", user!.id)
    .single();

  const rawProjects = client?.projects ?? [];
  const projects = (Array.isArray(rawProjects) ? rawProjects : [rawProjects]).filter(Boolean) as {
    id: string;
    name: string;
    type: string | null;
    status: string | null;
    location: string | null;
    started_at: string | null;
  }[];

  const greeting = client?.contact_name
    ? `Welcome back, ${client.contact_name.split(" ")[0]}.`
    : client?.company_name
    ? `Welcome back, ${client.company_name}.`
    : "Welcome back.";

  return <DashboardView projects={projects} greeting={greeting} />;
}
