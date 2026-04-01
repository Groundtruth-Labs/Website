import type { Metadata } from "next";
import Link from "next/link";
import { Award, Satellite, Users, Zap, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PilotCTA } from "@/components/marketing/PilotCTA";
import { Button } from "@/components/ui/button";
import { TeamSection } from "@/components/about/TeamSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Groundtruth Labs is a Hawaii-based remote sensing analytics company with ISEF-recognized research roots.",
};

const values = [
  {
    icon: Award,
    title: "Research rigor",
    description:
      "Our analytical methods come from ISEF-recognized research work. Every deliverable is documented and reproducible. We can show our work.",
  },
  {
    icon: MapPin,
    title: "Hawaii-rooted",
    description:
      "We understand Hawaii's terrain, microclimates, and agricultural practices. Reports come with local context, not just raw output.",
  },
  {
    icon: Satellite,
    title: "Satellite-first model",
    description:
      "Agriculture monitoring runs on Sentinel-2, free-forever satellite data that updates every 5 days. No flights, no FAA coordination, no scheduling delays.",
  },
  {
    icon: Zap,
    title: "Automated delivery",
    description:
      "Agriculture reports land in your dashboard every 5-day satellite pass. Construction engagements deliver within 48 hours of capture.",
  },
  {
    icon: Users,
    title: "Client-first",
    description:
      "We start every engagement with a discovery call. No surprise invoices, no scoping in the dark. You know what you're getting before we begin.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
              About us
            </span>
            <h1 className="font-mono text-5xl md:text-6xl font-bold text-slate-900 mt-4 leading-tight max-w-3xl">
              Analytics-first. Hawaii-based.
            </h1>
            <p className="font-sans text-xl text-slate-600 mt-6 max-w-2xl leading-relaxed">
              Satellite data updates every 5 days. Most farms still rely on
              site walks. We close that gap.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
                  Our story
                </span>
                <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-6">
                  Where we come from.
                </h2>
                <div className="space-y-4 font-sans text-slate-600 leading-relaxed">
                  <p>
                    Groundtruth Labs grew out of years of research experience,
                    including work recognized at the International Science and
                    Engineering Fair (ISEF). That foundation shapes how we
                    work: every analysis is documented, and every finding ties
                    back to an actual decision.
                  </p>
                  <p>
                    Hawaii&apos;s agriculture sector was an obvious fit.
                    Sentinel-2 satellites pass every 5 days at 10m resolution,
                    covering entire fields automatically. Most farms were still
                    relying on site walks. The gap between what was visible and
                    what was knowable was enormous.
                  </p>
                  <p>
                    We built Groundtruth Labs to close that gap: automated
                    satellite monitoring with research-grade analysis, delivered
                    to Hawaii&apos;s farms and construction sites as a simple
                    weekly report.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-6">
                  <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Agriculture
                  </p>
                  <h3 className="font-mono text-base font-semibold text-slate-900 mb-3">
                    Satellite, fully automated.
                  </h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    Sentinel-2 imagery comes in every 5 days. We run NDVI and
                    NDWI analysis automatically, flag anomalies, and deliver
                    a report without anyone scheduling a flight.
                  </p>
                </div>
                <div className="bg-cyan-700 rounded p-6">
                  <p className="font-mono text-xs font-semibold text-cyan-200 uppercase tracking-widest mb-2">
                    Construction
                  </p>
                  <h3 className="font-mono text-base font-semibold text-white mb-3">
                    Drone partners, fast turnaround.
                  </h3>
                  <p className="font-sans text-sm text-cyan-100 leading-relaxed">
                    Licensed local drone operators handle site captures under
                    FAA regulations. We take over at the processing pipeline
                    and deliver within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
              How we operate
            </span>
            <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-12">
              What you can expect.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-slate-200 rounded p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default"
                >
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cyan-700" />
                  </div>
                  <h3 className="font-mono text-sm font-semibold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        <TeamSection />

        {/* Contact */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-mono text-3xl font-bold text-slate-900 mb-4">
              Let&apos;s start a conversation.
            </h2>
            <p className="font-sans text-slate-600 max-w-xl mx-auto mb-8">
              Every engagement starts with a free discovery call. No commitment,
              no invoice, just a conversation about what you need and whether
              we&apos;re the right fit.
            </p>
            <Button size="lg" asChild>
              <Link href="/book">Book a discovery call</Link>
            </Button>
          </div>
        </section>

        <PilotCTA />
      </main>
      <Footer />
    </>
  );
}
