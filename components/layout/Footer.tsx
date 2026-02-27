import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceLinks = [
  { href: "/services/agriculture", label: "Agriculture Analytics" },
  { href: "/services/construction", label: "Construction Analytics" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/login", label: "Client Login" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/favicon.png"
                alt="Groundtruth Labs logo"
                width={28}
                height={28}
                className="rounded flex-shrink-0"
              />
              <span className="font-mono font-semibold text-slate-900 text-sm">
                Groundtruth Labs
              </span>
            </Link>
            <p className="text-sm font-sans text-slate-600 leading-relaxed">
              Aerial imagery analysis for Hawaii&apos;s farms and construction
              sites.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Services
            </p>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Company
            </p>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Get Started
            </p>
            <p className="text-sm font-sans text-slate-600 mb-4">
              Ready to see what your land looks like from above?
            </p>
            <Button size="sm" asChild>
              <Link href="/book" className="inline-flex items-center gap-1">
                Book a discovery call
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-slate-400">
            © {new Date().getFullYear()} Groundtruth Labs LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
