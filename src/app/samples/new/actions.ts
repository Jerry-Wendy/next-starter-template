"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function addSample(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessName = String(formData.get("business") || "").trim();
  const productId = String(formData.get("product_id") || "").trim();
  const colorId = String(formData.get("color_id") || "").trim();
  const sampleDescription = String(
    formData.get("sample_description") || ""
  ).trim();
  const internalCostRaw = String(
    formData.get("internal_cost") || ""
  ).trim();
  const engravingCostRaw = String(
    formData.get("engraving_cost") || ""
  ).trim();
  const dateGiven = String(formData.get("date_given") || "").trim();
  const result = String(formData.get("result") || "").trim();

  if (!businessName) {
    throw new Error("Business is required.");
  }

  if (!productId) {
    throw new Error("Product is required.");
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("name", businessName)
    .maybeSingle();

  if (businessError) {
    throw new Error(`Could not find business: ${businessError.message}`);
  }

  if (!business) {
    throw new Error(
      `Business "${businessName}" was not found. Please use an existing business name.`
    );
  }

  const { error } = await supabase.from("samples").insert({
    business_id: business.id,
    product_id: productId,
    color_id: colorId || null,
    sample_description: sampleDescription || null,
    internal_cost: internalCostRaw ? Number(internalCostRaw) : null,
    engraving_cost: engravingCostRaw ? Number(engravingCostRaw) : null,
    date_given: dateGiven || null,
    result: result || null,
  });

  if (error) {
    throw new Error(`Could not save sample: ${error.message}`);
  }

  redirect("/samples");
}
