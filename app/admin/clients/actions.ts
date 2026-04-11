"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInviteEmail } from "@/app/auth/actions";

/**
 * Resends a portal invite (or sends a magic link) to a client who has
 * signed up but hasn't completed onboarding. Works for both new and
 * existing Supabase auth users.
 */
export async function resendInvite(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return;

  try {
    await sendInviteEmail(email);
    revalidatePath("/admin/clients");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send invite";
    console.error("Resend invite error:", message);
    throw error;
  }
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

  try {
    await sendInviteEmail(email);
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send invite";
    console.error("Invite new client error:", message);
    return { error: message };
  }
}
