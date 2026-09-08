"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function updateProductColors(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const productId = String(formData.get("product_id") || "").trim();
  const colorIds = formData
    .getAll("color_ids")
    .map((value) => String(value));

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const { error: deleteError } = await supabase
    .from("product_colors")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    throw new Error(`Could not update colors: ${deleteError.message}`);
  }

  if (colorIds.length > 0) {
    const rows = colorIds.map((colorId) => ({
      product_id: productId,
      color_id: colorId,
    }));

    const { error: insertError } = await supabase
      .from("product_colors")
      .insert(rows);

    if (insertError) {
      throw new Error(`Could not save colors: ${insertError.message}`);
    }
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
}

export async function updateCatalogSettings(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const productId = String(formData.get("product_id") || "").trim();

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const showInCustomerCatalog =
    formData.get("show_in_customer_catalog") === "on";

  const localOnly =
    formData.get("local_only") === "on";

  const customerDescription =
    String(formData.get("customer_description") || "").trim() || null;

  const customerImageUrl =
    String(formData.get("customer_image_url") || "").trim() || null;

  const catalogCategory =
    String(formData.get("catalog_category") || "").trim() || null;

  const catalogSortOrder =
    Number(formData.get("catalog_sort_order") || 0);

  const { error } = await supabase
    .from("products")
    .update({
      show_in_customer_catalog: showInCustomerCatalog,
      local_only: localOnly,
      customer_description: customerDescription,
      customer_image_url: customerImageUrl,
      catalog_category: catalogCategory,
      catalog_sort_order: catalogSortOrder,
    })
    .eq("id", productId);

  if (error) {
    throw new Error(`Could not update catalog settings: ${error.message}`);
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
}

