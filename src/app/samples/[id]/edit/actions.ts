"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export async function updateSample(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "").trim();
  const notes = String(
    formData.get("sample_description") || ""
  ).trim();

  if (!id) {
    throw new Error("Sample ID is required.");
  }

  const { error } = await supabase
    .from("samples")
    .update({
      sample_description: notes || null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update sample: ${error.message}`);
  }

  redirect("/samples");
}