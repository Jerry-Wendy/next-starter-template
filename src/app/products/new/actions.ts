"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function addProduct(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const manufacturer = String(formData.get("manufacturer") || "").trim();
  const supplier = String(formData.get("supplier") || "").trim();
  const wholesaleCost = String(formData.get("wholesale_cost") || "").trim();
  const retailPrice = String(formData.get("retail_price") || "").trim();
  const engravingFee = String(formData.get("additional_engraving_fee") || "").trim();
  const availability = String(formData.get("availability") || "").trim();
  const internalNotes = String(formData.get("internal_notes") || "").trim();

  if (!name) {
    throw new Error("Product name is required.");
  }

  const { error } = await supabase.from("products").insert({
    name,
    sku: sku || null,
    category: category || null,
    description: description || null,
    manufacturer: manufacturer || null,
    supplier: supplier || null,
    wholesale_cost: wholesaleCost ? Number(wholesaleCost) : null,
    retail_price: retailPrice ? Number(retailPrice) : null,
    additional_engraving_fee: engravingFee ? Number(engravingFee) : null,
    availability: availability || null,
    internal_notes: internalNotes || null,
    active: true,
  });

  if (error) {
    throw new Error(`Could not save product: ${error.message}`);
  }

  redirect("/products");
}
