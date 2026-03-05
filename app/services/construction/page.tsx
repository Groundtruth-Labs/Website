import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConstructionContent } from "@/components/marketing/ConstructionContent";

export const metadata: Metadata = {
  title: "Construction Analytics",
  description:
    "Site progress tracking, change detection, and aerial documentation for construction projects across Hawaii.",
};

export default function ConstructionPage() {
  return (
    <>
      <Navbar />
      <ConstructionContent />
      <Footer />
    </>
  );
}
