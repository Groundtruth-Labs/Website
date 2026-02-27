import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin | Groundtruth Labs",
    template: "%s | Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: client }, { count: unreadContacts }] = await Promise.all([
    supabase
      .from("clients")
      .select("contact_name, company_name, is_admin")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  if (!client?.is_admin) redirect("/");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar
        userName={client.contact_name ?? "Admin"}
        userEmail={user.email ?? ""}
        unreadContacts={unreadContacts ?? 0}
      />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
