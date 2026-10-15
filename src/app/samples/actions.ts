"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";

export async function deleteSample(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Sample ID is required.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("samples")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Could not delete sample: ${error.message}`);
  }

  revalidatePath("/samples");
}