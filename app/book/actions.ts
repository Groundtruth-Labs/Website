"use server";

import { createClient } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitBooking(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string | null;
  const company = formData.get("company") as string | null;
  const location = formData.get("location") as string | null;
  const industry = formData.get("industry") as string | null;
  const best_time = formData.get("best_time") as string | null;
  const message = formData.get("message") as string | null;

  if (!full_name || !email) {
    return { status: "error", message: "Name and email are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    full_name,
    email,
    phone: phone || null,
    company: company || null,
    location: location || null,
    industry: industry || null,
    best_time: best_time || null,
    message: message || null,
  });

  if (error) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}
