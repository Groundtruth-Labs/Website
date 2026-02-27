import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { HowItWorksWrapper } from "@/components/marketing/HowItWorksWrapper";
import { Deliverables } from "@/components/marketing/Deliverables";
import { TrustSignals } from "@/components/marketing/TrustSignals";
import { Reviews } from "@/components/marketing/Reviews";
import { PilotCTA } from "@/components/marketing/PilotCTA";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, client_name, company, industry, content, rating")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorksWrapper />
        <Deliverables />
        <TrustSignals />
        <Reviews reviews={reviews ?? []} />
        <PilotCTA />
      </main>
      <Footer />
    </>
  );
}
