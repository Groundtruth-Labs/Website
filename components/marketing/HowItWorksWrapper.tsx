"use client";

import dynamic from "next/dynamic";

const HowItWorks = dynamic(
  async () => {
    const { HowItWorks } = await import("@/components/marketing/HowItWorks");
    return { default: HowItWorks };
  },
  { ssr: false }
);

export function HowItWorksWrapper() {
  return <HowItWorks />;
}
