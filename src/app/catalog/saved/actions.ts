"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function deleteCatalog(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const catalogId = String(formData.get("catalog_id") ?? "");

  if (!catalogId) {
    throw new Error("Missing catalog ID");
  }

  const { error } = await supabase
    .from("saved_catalogs")
    .delete()
    .eq("id", catalogId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/catalog/saved");
}
