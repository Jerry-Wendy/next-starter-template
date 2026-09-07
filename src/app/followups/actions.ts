"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";

export async function completeFollowUp(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Follow-up ID is required.");
  }

  const { error } = await supabase
    .from("followups")
    .update({
      status: "Completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not complete follow-up: ${error.message}`);
  }

  revalidatePath("/followups");
  revalidatePath("/");
}
