
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";


export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Missing product ID");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/products");
}
