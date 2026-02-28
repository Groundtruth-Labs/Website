"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Creates a new project for a client.
 */
export async function createProject(formData: FormData) {
  const client_id = formData.get("client_id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const location = (formData.get("location") as string) || null;

  if (!client_id || !name || !type) return { error: "Missing required fields" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("projects").insert({
    client_id,
    name,
    type,
    location,
    status: "active",
    started_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

/**
 * Uploads NDVI stats JSON to an existing or newly-created deliverable.
 * If a deliverable of type "ndvi" already exists for the project, updates it.
 * Otherwise creates a new one.
 */
export async function uploadNdviStats(formData: FormData) {
  const project_id = formData.get("project_id") as string;
  const json_raw = formData.get("ndvi_json") as string;
  const captured_at = (formData.get("captured_at") as string) || null;

  if (!project_id || !json_raw) return { error: "Missing project or JSON" };

  let ndvi_stats: unknown;
  try {
    ndvi_stats = JSON.parse(json_raw);
  } catch {
    return { error: "Invalid JSON" };
  }

  const supabase = createAdminClient();

  // Check for existing NDVI deliverable on this project
  const { data: existing } = await supabase
    .from("deliverables")
    .select("id")
    .eq("project_id", project_id)
    .eq("type", "ndvi")
    .maybeSingle();

  let writeError: { message: string } | null = null;

  if (existing) {
    const { error } = await supabase
      .from("deliverables")
      .update({
        ndvi_stats: ndvi_stats as never,
        captured_at: captured_at ?? new Date().toISOString(),
      })
      .eq("id", existing.id);
    writeError = error;
  } else {
    const { error } = await supabase.from("deliverables").insert({
      project_id,
      name: "NDVI Analysis",
      type: "ndvi",
      ndvi_stats: ndvi_stats as never,
      captured_at: captured_at ?? new Date().toISOString(),
    });
    writeError = error;
  }

  if (writeError) return { error: writeError.message };

  revalidatePath("/admin/projects");
  revalidatePath("/dashboard");
}

/**
 * Uploads one or more PNG figures from the pipeline output to Supabase Storage,
 * then creates a deliverable record per file.
 */
export async function uploadFigures(formData: FormData) {
  const project_id = formData.get("project_id") as string;
  const captured_at = (formData.get("captured_at") as string) || null;
  const files = formData.getAll("files") as File[];
  const customLabels = formData.getAll("labels") as string[];

  if (!project_id) return { error: "Missing project ID" };
  if (!files.length) return { error: "No files selected" };

  const supabase = createAdminClient();
  const ts = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${project_id}/${ts}-${i}-${safeName}`;

    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("deliverables")
      .upload(storagePath, bytes, { contentType: file.type, upsert: false });

    if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

    // Use custom label if provided, otherwise derive from filename
    const label =
      customLabels[i]?.trim() ||
      file.name
        .replace(/\.(png|jpg|jpeg|webp)$/i, "")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) ||
      "Figure";

    const { error: dbError } = await supabase.from("deliverables").insert({
      project_id,
      name: label,
      type: "figure",
      file_url: storagePath,
      captured_at: captured_at || new Date().toISOString(),
    });

    if (dbError) return { error: `DB write failed: ${dbError.message}` };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/dashboard");
}

/**
 * Creates a new client account with email and password.
 * Admin can optionally set a password, or client can set it on first login.
 */
export async function createClientAccount(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const company_name = formData.get("company_name") as string;
  const contact_name = (formData.get("contact_name") as string) || null;
  const industry = (formData.get("industry") as string) || null;

  if (!email || !password) return { error: "Email and password required" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const supabase = createAdminClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Failed to create user" };
  }

  // Create client record
  const { error: clientError } = await supabase.from("clients").insert({
    user_id: authData.user.id,
    company_name: company_name || "Unnamed Company",
    industry: industry || null,
    contact_name: contact_name || null,
    contact_email: email,
  });

  if (clientError) {
    // Clean up auth user if client creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { error: `Failed to create client record: ${clientError.message}` };
  }

  revalidatePath("/admin/clients");
  return { success: true, user_id: authData.user.id };
}
