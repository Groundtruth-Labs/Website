"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Leaf,
  HardHat,
  TrendingUp,
  Droplets,
  Eye,
  BarChart3,
  GitCompare,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const services = [
  {
    slug: "agriculture",
    icon: Leaf,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Agriculture Analytics",
    description:
      "Spot crop stress before it costs you. From orchards to row crops, we map what you can't see from the ground.",
    badge: "Most popular",
    badgeVariant: "success" as const,
    items: [
      { icon: TrendingUp, label: "NDVI crop stress mapping" },
      { icon: Eye, label: "Growth stage monitoring" },
      { icon: Droplets, label: "Irrigation efficiency analysis" },
      { icon: BarChart3, label: "Yield prediction support" },
    ],
    href: "/services/agriculture",
  },
  {
    slug: "construction",
    icon: HardHat,
    iconColor: "text-cyan-700",
    iconBg: "bg-cyan-50",
    title: "Construction Analytics",
    description:
      "Track every phase of your site from first earthwork to final walkthrough. Progress reports, change detection, and aerial docs your whole team can use.",
    badge: null,
    badgeVariant: null,
    items: [
      { icon: BarChart3, label: "Site progress reporting" },
      { icon: GitCompare, label: "Change detection over time" },
      { icon: ClipboardList, label: "Volume calculations" },
      { icon: Eye, label: "Compliance documentation" },
    ],
    href: "/services/construction",
  },
];

export function Services() {
  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
            What we do
          </span>
          <h2 className="font-mono text-4xl font-bold text-slate-900 mt-3">
            Analytics built for your industry.
          </h2>
          <p className="font-sans text-slate-600 mt-4 max-w-xl text-lg">
            Two industries where aerial data changes what you decide.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const ServiceIcon = service.icon;
            return (
              <motion.div
                suppressHydrationWarning
                key={service.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.12, ease: "easeOut" }}
              >
              <Card
                className="group hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded ${service.iconBg} flex items-center justify-center`}
                    >
                      <ServiceIcon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                    {service.badge && (
                      <Badge variant={service.badgeVariant ?? "default"}>
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 mb-6">
                    {service.items.map(({ icon: ItemIcon, label }) => (
                      <li key={label} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <ItemIcon className="w-3 h-3 text-slate-500" />
                        </div>
                        <span className="font-sans text-sm text-slate-700">
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-cyan-700 hover:text-cyan-800 group-hover:gap-2.5 transition-all"
                  >
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary mention */}
        <motion.p
          suppressHydrationWarning
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-sans text-sm text-slate-400 mt-8 text-center"
        >
          Also serving solar farms and golf courses.{" "}
          <Link href="/about" className="text-slate-500 hover:text-slate-700 underline underline-offset-2">
            Learn about our model →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
