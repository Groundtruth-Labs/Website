import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookCallForm } from "@/components/book/BookCallForm";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description:
    "Schedule a free discovery call with Groundtruth Labs. Tell us about your site and we'll scope the right deliverable package for you.",
};

const callDetails = [
  { icon: Clock, text: "30 minutes" },
  { icon: MapPin, text: "Phone or video, your preference" },
  { icon: CheckCircle2, text: "No invoice until scope is agreed" },
];

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: context */}
            <div className="lg:sticky lg:top-28">
              <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
                Free consultation
              </span>
              <h1 className="font-mono text-4xl font-bold text-slate-900 mt-3 leading-tight">
                Let&apos;s talk about your site.
              </h1>
              <p className="font-sans text-slate-600 mt-4 leading-relaxed">
                Every engagement starts here. We use the discovery call to
                understand your operation, define what data you actually need,
                and build a scope before anything is invoiced.
              </p>

              <ul className="space-y-3 mt-8">
                {callDetails.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-50 border border-cyan-100 rounded flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-cyan-700" />
                    </div>
                    <span className="font-sans text-sm text-slate-600">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 bg-white border border-slate-200 rounded p-6 shadow-sm">
                <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  What to expect
                </p>
                <ol className="space-y-3">
                  {[
                    "You fill out the form. We review it before the call.",
                    "We reach out within one business day to confirm a time.",
                    "On the call: your goals, your site, what deliverables make sense.",
                    "We send a written scope and quote. No surprises.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-xs font-bold text-cyan-700 mt-0.5 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-sans text-sm text-slate-600">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-white border border-slate-200 rounded p-8 shadow-sm">
              <BookCallForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
