"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const phone = (formData.get("phone") as string)?.trim() || null;

  const admin = createAdminClient();
  const clientPayload = {
    user_id: user.id,
    company_name: company_name || null,
    contact_name: contact_name || null,
    contact_email: contact_email ?? null,
    industry,
    location,
    phone,
    onboarded: true,
  };

  // Avoid depending on a unique constraint for user_id or client-side RLS.
  const { data: existingClient, error: existingClientError } = await admin
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingClientError) {
    throw new Error(`Failed to load onboarding record: ${existingClientError.message}`);
  }

  const { error: saveError } = existingClient
    ? await admin.from("clients").update(clientPayload).eq("id", existingClient.id)
    : await admin.from("clients").insert(clientPayload);

  if (saveError) {
    throw new Error(`Failed to save onboarding: ${saveError.message}`);
  }

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/book");
  redirect("/dashboard");
}
