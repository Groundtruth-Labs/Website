"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveReview(id: string) {
  const supabase = await createClient();
  await supabase.from("reviews").update({ approved: true }).eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}

export async function rejectReview(id: string) {
  const supabase = await createClient();
  await supabase.from("reviews").update({ approved: false }).eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}

export async function createReview(formData: FormData) {
  const supabase = await createClient();
  const client_name = formData.get("client_name") as string;
  const company = formData.get("company") as string;
  const industry = formData.get("industry") as string;
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const approved = formData.get("approved") === "true";

  if (!client_name || !content) return;

  await supabase.from("reviews").insert({
    client_name,
    company: company || null,
    industry: industry || null,
    content,
    rating,
    approved,
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  revalidatePath("/");
}
