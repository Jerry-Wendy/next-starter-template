"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCatalog(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const businessId = String(formData.get("business_id") || "").trim();
  const catalogName = String(formData.get("catalog_name") || "").trim();
  const productIds = formData
    .getAll("product_ids")
    .map((value) => String(value))
    .filter(Boolean);

  if (!businessId) {
    throw new Error("Business is required.");
  }

  if (!catalogName) {
    throw new Error("Catalog name is required.");
  }

  if (productIds.length === 0) {
    throw new Error("At least one product is required.");
  }

  const { error } = await supabase.from("saved_catalogs").insert({
    business_id: businessId,
    catalog_name: catalogName,
    product_ids: productIds,
  });

  if (error) {
    throw new Error(`Could not save catalog: ${error.message}`);
  }

  revalidatePath("/catalog");
}
