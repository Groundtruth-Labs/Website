import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/dashboard/OnboardingForm";

export const metadata = {
  title: "Set up your dashboard | Groundtruth Labs",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch client data to check onboarding state
  const { data: client } = await supabase
    .from("clients")
    .select("is_admin, onboarded")
    .eq("user_id", user.id)
    .single();

  // Admins go to their panel; already-onboarded clients go to dashboard
  if (client?.is_admin) redirect("/admin");
  if (client?.onboarded) redirect("/dashboard");

  // Look up contact submission by email for prefill — best-effort
  const { data: submission } = await supabase
    .from("contact_submissions")
    .select("full_name, company, industry, location")
    .eq("email", user.email ?? "")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const prefill = submission
    ? {
        contact_name: submission.full_name,
        company_name: submission.company,
        industry: submission.industry,
        location: submission.location,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Brand mark */}
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Image
          src="/favicon.png"
          alt="Groundtruth Labs logo"
          width={32}
          height={32}
          className="rounded flex-shrink-0"
        />
        <span className="font-mono font-semibold text-slate-900">
          Groundtruth Labs
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded shadow-sm p-8">
        {/* Header */}
        <div className="mb-8">
          <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
            One-time setup
          </span>
          <h1 className="font-mono text-2xl font-bold text-slate-900 mt-2 leading-tight">
            Let&apos;s set up your dashboard.
          </h1>
          <p className="font-sans text-sm text-slate-500 mt-2 leading-relaxed">
            Quick details so we know who we&apos;re working with. Takes about
            30 seconds.
          </p>
        </div>

        <OnboardingForm email={user.email ?? ""} prefill={prefill} />
      </div>

      {/* Footer note */}
      <p className="font-sans text-xs text-slate-400 mt-6 text-center">
        Your data is ready and waiting.
      </p>
    </div>
  );
}
