"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markAsHandled(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();

  // Get current admin's email
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("contact_submissions")
    .update({
      handled_by: user?.email ?? "unknown",
      handled_at: new Date().toISOString(),
      is_read: true,
    })
    .eq("id", id);

  revalidatePath("/admin/support");
  revalidatePath("/admin");
}

export async function markAsUnhandled(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();

  await supabase
    .from("contact_submissions")
    .update({
      handled_by: null,
      handled_at: null,
    })
    .eq("id", id);

  revalidatePath("/admin/support");
  revalidatePath("/admin");
}

/**
 * Invites a contact to the portal by email.
 * - New users: creates an account and sends an invite email.
 * - Existing users: sends a magic link email.
 * On success, records invited_at on the contact submission.
 */
export async function inviteContact(formData: FormData) {
  const id = formData.get("id") as string;
  const email = formData.get("email") as string;
  if (!id || !email) return;

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
  });

  if (!error) {
    // Record the invite timestamp on the submission
    const supabase = await createClient();
    await supabase
      .from("contact_submissions")
      .update({ invited_at: new Date().toISOString() })
      .eq("id", id);
  }

  revalidatePath("/admin/support");
}

export async function markAllAsRead() {
  const supabase = await createClient();

  await supabase
    .from("contact_submissions")
    .update({ is_read: true })
    .eq("is_read", false);

  revalidatePath("/admin/support");
  revalidatePath("/admin");
}
