import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Users, MessageSquare, Star, TrendingUp, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  iconBg: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-slate-200 rounded p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 rounded ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} style={{ width: 18, height: 18 }} />
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
      <div className="font-mono text-2xl font-bold text-slate-900">{value}</div>
      {sub && (
        <div className="font-sans text-xs text-slate-400 mt-0.5">{sub}</div>
      )}
      <div className="font-sans text-sm text-slate-500 mt-1">{label}</div>
    </Link>
  );
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const industryLabel: Record<string, string> = {
  agriculture: "Agriculture",
  construction: "Construction",
  solar: "Solar",
  golf: "Golf",
  other: "Other",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: clientCount },
    { count: submissionCount },
    { count: pendingReviewCount },
    { count: projectCount },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", false),
    supabase.from("projects").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentSubmissions } = await supabase
    .from("contact_submissions")
    .select("id, full_name, email, company, industry, created_at, best_time")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: pendingReviews } = await supabase
    .from("reviews")
    .select("id, client_name, company, industry, content, rating, created_at")
    .eq("approved", false)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <h1 className="font-mono text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="font-sans text-sm text-slate-500 mt-0.5">
          Welcome to the Groundtruth Labs admin panel.
        </p>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Clients"
            value={clientCount ?? 0}
            icon={Users}
            iconColor="text-cyan-700"
            iconBg="bg-cyan-50"
            href="/admin/clients"
          />
          <StatCard
            label="Contact Submissions"
            value={submissionCount ?? 0}
            icon={MessageSquare}
            iconColor="text-cyan-700"
            iconBg="bg-cyan-50"
            href="/admin/support"
          />
          <StatCard
            label="Pending Reviews"
            value={pendingReviewCount ?? 0}
            sub={pendingReviewCount ? "awaiting approval" : "all clear"}
            icon={Star}
            iconColor="text-cyan-700"
            iconBg="bg-cyan-50"
            href="/admin/reviews"
          />
          <StatCard
            label="Projects"
            value={projectCount ?? 0}
            icon={TrendingUp}
            iconColor="text-cyan-700"
            iconBg="bg-cyan-50"
            href="/admin/clients"
          />
        </div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent contacts */}
          <div className="bg-white border border-slate-200 rounded">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-mono text-sm font-semibold text-slate-900">
                  Recent Contacts
                </h2>
                <p className="font-sans text-xs text-slate-400 mt-0.5">
                  Latest discovery call requests
                </p>
              </div>
              <Link
                href="/admin/support"
                className="font-sans text-xs text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentSubmissions && recentSubmissions.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentSubmissions.map((s) => (
                  <div key={s.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium text-slate-900 truncate">
                        {s.full_name}
                      </p>
                      <p className="font-sans text-xs text-slate-400 truncate">
                        {s.company ?? s.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      {s.industry && (
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                          {industryLabel[s.industry] ?? s.industry}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span className="font-sans text-xs">{formatDate(s.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm text-slate-400 px-6 py-8 text-center">
                No submissions yet.
              </p>
            )}
          </div>

          {/* Pending reviews */}
          <div className="bg-white border border-slate-200 rounded">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-mono text-sm font-semibold text-slate-900">
                  Pending Reviews
                </h2>
                <p className="font-sans text-xs text-slate-400 mt-0.5">
                  Reviews awaiting approval
                </p>
              </div>
              <Link
                href="/admin/reviews"
                className="font-sans text-xs text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {pendingReviews && pendingReviews.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {pendingReviews.map((r) => (
                  <div key={r.id} className="px-6 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-sans text-sm font-medium text-slate-900">
                        {r.client_name}
                        {r.company && (
                          <span className="text-slate-400 font-normal">
                            {" "}· {r.company}
                          </span>
                        )}
                      </p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < r.rating ? "text-amber-400" : "text-slate-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="font-sans text-xs text-slate-500 line-clamp-2">
                      {r.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm text-slate-400 px-6 py-8 text-center">
                No pending reviews.
              </p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-slate-200 rounded px-6 py-5">
          <h2 className="font-mono text-sm font-semibold text-slate-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/admin/reviews", label: "Add Review", icon: Star },
              { href: "/admin/support", label: "View Contacts", icon: MessageSquare },
              { href: "/admin/clients", label: "Browse Clients", icon: Users },
              { href: "/admin/analytics", label: "View Analytics", icon: TrendingUp },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded text-sm font-sans text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
