"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Resends a portal invite (or sends a magic link) to a client who has
 * signed up but hasn't completed onboarding. Works for both new and
 * existing Supabase auth users.
 */
export async function resendInvite(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return;

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
  });

  revalidatePath("/admin/clients");
}

/**
 * Directly invites a brand-new client by email from the admin panel.
 * Works whether or not they have an existing Supabase auth account.
 * The invite email includes a link to /onboarding where they fill in
 * their company name, location, etc.
 */
export async function inviteNewClient(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/clients");
}
