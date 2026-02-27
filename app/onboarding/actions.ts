"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const company_name = (formData.get("company_name") as string)?.trim();
  const contact_name = (formData.get("contact_name") as string)?.trim();
  const contact_email = (formData.get("contact_email") as string)?.trim() || user.email;
  const industry = (formData.get("industry") as string) || null;
  const location = (formData.get("location") as string)?.trim() || null;

  await supabase
    .from("clients")
    .update({
      company_name: company_name || null,
      contact_name: contact_name || null,
      contact_email: contact_email ?? null,
      industry: industry,
      location: location,
      onboarded: true,
    })
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
