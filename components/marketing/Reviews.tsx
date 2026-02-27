"use client";

import { motion } from "motion/react";

interface Review {
  id: string;
  client_name: string;
  company: string | null;
  industry: string | null;
  content: string;
  rating: number;
}

const industryDot: Record<string, string> = {
  agriculture: "bg-green-500",
  construction: "bg-cyan-600",
  solar: "bg-amber-400",
  golf: "bg-emerald-500",
};

export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
            From the field
          </span>
          <h2 className="font-mono text-4xl font-bold text-slate-900 mt-3">
            What clients say.
          </h2>
          <p className="font-sans text-slate-600 mt-4 max-w-xl text-lg">
            Real results from agriculture and construction operators across Hawaii.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              suppressHydrationWarning
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.15, ease: "easeOut" } }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="bg-white border border-slate-200 rounded p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span
                    key={j}
                    className={`text-base ${j < review.rating ? "text-amber-400" : "text-slate-200"}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="font-sans text-sm text-slate-700 leading-relaxed flex-1">
                &ldquo;{review.content}&rdquo;
              </p>

              {/* Attribution */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                {review.industry && (
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${industryDot[review.industry] ?? "bg-slate-400"}`}
                  />
                )}
                <div>
                  <p className="font-mono text-xs font-semibold text-slate-900">
                    {review.client_name}
                  </p>
                  {review.company && (
                    <p className="font-sans text-xs text-slate-400 mt-0.5">
                      {review.company}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
