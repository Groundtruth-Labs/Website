import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { approveReview, rejectReview, deleteReview, createReview } from "./actions";
import { CheckCircle2, XCircle, Trash2, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Reviews" };

const industryLabel: Record<string, string> = {
  agriculture: "Agriculture",
  construction: "Construction",
  solar: "Solar",
  golf: "Golf",
  other: "Other",
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-amber-400" : "text-slate-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const approved = reviews?.filter((r) => r.approved) ?? [];
  const pending = reviews?.filter((r) => !r.approved) ?? [];

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <h1 className="font-mono text-xl font-bold text-slate-900">Reviews</h1>
        <p className="font-sans text-sm text-slate-500 mt-0.5">
          Manage client testimonials shown on the public site.
        </p>
      </div>

      <div className="p-8 space-y-8">
        {/* Add review form */}
        <div className="bg-white border border-slate-200 rounded">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-700" />
            <h2 className="font-mono text-sm font-semibold text-slate-900">
              Add Review
            </h2>
          </div>
          <form action={createReview} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">
                Client Name *
              </label>
              <input
                name="client_name"
                required
                placeholder="Jane Smith"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">
                Company
              </label>
              <input
                name="company"
                placeholder="Acme Farms LLC"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">
                Industry
              </label>
              <select
                name="industry"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent"
              >
                <option value="">Select industry</option>
                <option value="agriculture">Agriculture</option>
                <option value="construction">Construction</option>
                <option value="solar">Solar</option>
                <option value="golf">Golf</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">
                Rating
              </label>
              <select
                name="rating"
                defaultValue="5"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {"★".repeat(n)} ({n}/5)
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">
                Review Content *
              </label>
              <textarea
                name="content"
                required
                rows={3}
                placeholder="What the client said..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent resize-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="hidden" name="approved" value="false" />
                <input
                  type="checkbox"
                  name="approved"
                  value="true"
                  className="w-4 h-4 accent-cyan-700"
                />
                <span className="font-sans text-sm text-slate-600">
                  Approve immediately
                </span>
              </label>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-700 text-white text-sm font-sans rounded hover:bg-cyan-800 transition-colors"
              >
                Add Review
              </button>
            </div>
          </form>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="bg-white border border-slate-200 rounded">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-mono text-sm font-semibold text-slate-900">
                Pending Approval
                <span className="ml-2 font-mono text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                  {pending.length}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-slate-50">
              {pending.map((r) => (
                <div key={r.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-sans text-sm font-semibold text-slate-900">
                        {r.client_name}
                      </span>
                      {r.company && (
                        <span className="font-sans text-xs text-slate-400">
                          {r.company}
                        </span>
                      )}
                      {r.industry && (
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                          {industryLabel[r.industry] ?? r.industry}
                        </span>
                      )}
                      <StarDisplay rating={r.rating} />
                    </div>
                    <p className="font-sans text-sm text-slate-600 leading-relaxed">
                      {r.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <form action={approveReview.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-green-700 bg-green-50 hover:bg-green-100 rounded transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    </form>
                    <form action={deleteReview.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved */}
        <div className="bg-white border border-slate-200 rounded">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-mono text-sm font-semibold text-slate-900">
              Live on Site
              <span className="ml-2 font-mono text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                {approved.length}
              </span>
            </h2>
          </div>
          {approved.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {approved.map((r) => (
                <div key={r.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-sans text-sm font-semibold text-slate-900">
                        {r.client_name}
                      </span>
                      {r.company && (
                        <span className="font-sans text-xs text-slate-400">
                          {r.company}
                        </span>
                      )}
                      {r.industry && (
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                          {industryLabel[r.industry] ?? r.industry}
                        </span>
                      )}
                      <StarDisplay rating={r.rating} />
                    </div>
                    <p className="font-sans text-sm text-slate-600 leading-relaxed">
                      {r.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <form action={rejectReview.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-slate-500 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Unpublish
                      </button>
                    </form>
                    <form action={deleteReview.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans text-sm text-slate-400 px-6 py-8 text-center">
              No approved reviews yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
