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

export async function addPricingTier(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const productId = String(formData.get("product_id") || "").trim();
  const minQuantity = Number(formData.get("min_quantity"));
  const maxRaw = String(formData.get("max_quantity") || "").trim();
  const unitPriceRaw = String(formData.get("unit_price") || "").trim();
  const priceLabel = String(formData.get("price_label") || "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") || 0);

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!Number.isFinite(minQuantity) || minQuantity < 1) {
    throw new Error("Minimum quantity must be at least 1.");
  }

  const maxQuantity = maxRaw ? Number(maxRaw) : null;
  const unitPrice = unitPriceRaw ? Number(unitPriceRaw) : null;

  if (maxQuantity !== null && !Number.isFinite(maxQuantity)) {
    throw new Error("Maximum quantity is invalid.");
  }

  if (unitPrice !== null && !Number.isFinite(unitPrice)) {
    throw new Error("Unit price is invalid.");
  }

  if (unitPrice === null && !priceLabel) {
    throw new Error("Enter either a unit price or a price label such as Contact Us.");
  }

  const { error } = await supabase
    .from("product_pricing_tiers")
    .insert({
      product_id: productId,
      min_quantity: minQuantity,
      max_quantity: maxQuantity,
      unit_price: unitPrice,
      price_label: priceLabel,
      sort_order: sortOrder,
    });

  if (error) {
    throw new Error(`Could not add pricing tier: ${error.message}`);
  }

  revalidatePath(`/products/${productId}`);
}

export async function deletePricingTier(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const tierId = String(formData.get("tier_id") || "").trim();
  const productId = String(formData.get("product_id") || "").trim();

  if (!tierId || !productId) {
    throw new Error("Pricing tier information is required.");
  }

  const { error } = await supabase
    .from("product_pricing_tiers")
    .delete()
    .eq("id", tierId);

  if (error) {
    throw new Error(`Could not delete pricing tier: ${error.message}`);
  }

  revalidatePath(`/products/${productId}`);
}

export async function uploadProductImage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const productId = String(formData.get("product_id") || "").trim();
  const file = formData.get("product_image");

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please choose an image file.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WEBP image.");
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filePath = `${productId}/customer.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("Product images")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(`Could not upload image: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("Product images")
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("products")
    .update({
      customer_image_url: publicUrlData.publicUrl,
    })
    .eq("id", productId);

  if (updateError) {
    throw new Error(`Could not save image URL: ${updateError.message}`);
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
}
