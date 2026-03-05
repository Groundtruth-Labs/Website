import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AgricultureContent } from "@/components/marketing/AgricultureContent";

export const metadata: Metadata = {
  title: "Agriculture Analytics",
  description:
    "NDVI mapping, crop stress detection, and precision monitoring for orchards, row crops, and pasture across Hawaii.",
};

export default function AgriculturePage() {
  return (
    <>
      <Navbar />
      <AgricultureContent />
      <Footer />
    </>
  );
}
