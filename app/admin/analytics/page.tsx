import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Users, MessageSquare, FolderOpen, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import InteractiveChart from "@/components/admin/InteractiveChart";

export const metadata: Metadata = { title: "Analytics" };

// ─── helpers ────────────────────────────────────────────────────────────────

function generateDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().split("T")[0];
  });
}

function buildSeries(
  records: { created_at: string }[] | null,
  days: string[]
): number[] {
  const counts: Record<string, number> = {};
  records?.forEach((r) => {
    const day = r.created_at.split("T")[0];
    counts[day] = (counts[day] ?? 0) + 1;
  });
  return days.map((d) => counts[d] ?? 0);
}

// SparkChart is now the InteractiveChart client component (imported above)

// ─── chart card ──────────────────────────────────────────────────────────────

function ChartCard({
  label,
  total,
  data,
  color,
  bgTint,
  icon: Icon,
  gradId,
  days,
}: {
  label: string;
  total: number;
  data: number[];
  color: string;
  bgTint: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  gradId: string;
  days: string[];
}) {
  // Compare last 7 days vs prior 7 days
  const recent = data.slice(-7).reduce((a, b) => a + b, 0);
  const prior = data.slice(-14, -7).reduce((a, b) => a + b, 0);
  const diff = recent - prior;

  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded ${bgTint} flex items-center justify-center`}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
              {label}
            </p>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
          <span
            className="font-mono text-2xl font-bold"
            style={{ color }}
          >
            {total}
          </span>
          {diff !== 0 ? (
            <span
              className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold px-1.5 py-0.5 rounded ${
                diff > 0
                  ? "text-green-700 bg-green-50"
                  : "text-red-600 bg-red-50"
              }`}
            >
              {diff > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {diff > 0 ? "+" : ""}
              {diff}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold px-1.5 py-0.5 rounded text-slate-400 bg-slate-50">
              <Minus className="w-3 h-3" />
              0
            </span>
          )}
        </div>
      </div>

      {/* Chart area */}
      <div className="px-5 py-3 h-32">
        <InteractiveChart data={data} color={color} gradId={gradId} days={days} />
      </div>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const days = generateDays(30);
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceISO = since.toISOString();

  const [
    { data: clientRecs },
    { data: contactRecs },
    { data: projectRecs },
    { data: reviewRecs },
    { count: totalClients },
    { count: totalContacts },
    { count: totalProjects },
    { count: totalReviews },
  ] = await Promise.all([
    supabase.from("clients").select("created_at").gte("created_at", sinceISO),
    supabase
      .from("contact_submissions")
      .select("created_at")
      .gte("created_at", sinceISO),
    supabase.from("projects").select("created_at").gte("created_at", sinceISO),
    supabase.from("reviews").select("created_at").gte("created_at", sinceISO),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
  ]);

  const clientSeries = buildSeries(clientRecs, days);
  const contactSeries = buildSeries(contactRecs, days);
  const projectSeries = buildSeries(projectRecs, days);
  const reviewSeries = buildSeries(reviewRecs, days);

  const clientTotal = clientSeries.reduce((a, b) => a + b, 0);
  const contactTotal = contactSeries.reduce((a, b) => a + b, 0);
  const projectTotal = projectSeries.reduce((a, b) => a + b, 0);
  const reviewTotal = reviewSeries.reduce((a, b) => a + b, 0);

  const summaryStats = [
    { label: "Total Clients", value: totalClients ?? 0, icon: Users, color: "text-cyan-700", bg: "bg-cyan-50" },
    { label: "Contact Submissions", value: totalContacts ?? 0, icon: MessageSquare, color: "text-cyan-700", bg: "bg-cyan-50" },
    { label: "Projects", value: totalProjects ?? 0, icon: FolderOpen, color: "text-cyan-700", bg: "bg-cyan-50" },
    { label: "Reviews", value: totalReviews ?? 0, icon: Star, color: "text-cyan-700", bg: "bg-cyan-50" },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <h1 className="font-mono text-xl font-bold text-slate-900">
          Analytics
        </h1>
        <p className="font-sans text-sm text-slate-500 mt-0.5">
          Activity over the last 30 days.
        </p>
      </div>

      <div className="p-8 space-y-6">
        {/* All-time summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((s) => {
            const SIcon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white border border-slate-200 rounded shadow-sm px-5 py-4 flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded ${s.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <SIcon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="font-mono text-xl font-bold text-slate-900">
                    {s.value}
                  </div>
                  <div className="font-sans text-xs text-slate-500">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 30-day period label */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest px-2">
            Last 30 days
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* 2x2 chart grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard
            label="New Clients"
            total={clientTotal}
            data={clientSeries}
            color="#0e7490"
            bgTint="bg-cyan-50"
            icon={Users}
            gradId="grad-clients"
            days={days}
          />
          <ChartCard
            label="Contact Submissions"
            total={contactTotal}
            data={contactSeries}
            color="#0e7490"
            bgTint="bg-cyan-50"
            icon={MessageSquare}
            gradId="grad-contacts"
            days={days}
          />
          <ChartCard
            label="Projects Created"
            total={projectTotal}
            data={projectSeries}
            color="#0e7490"
            bgTint="bg-cyan-50"
            icon={FolderOpen}
            gradId="grad-projects"
            days={days}
          />
          <ChartCard
            label="Reviews Submitted"
            total={reviewTotal}
            data={reviewSeries}
            color="#0e7490"
            bgTint="bg-cyan-50"
            icon={Star}
            gradId="grad-reviews"
            days={days}
          />
        </div>
      </div>
    </div>
  );
}
