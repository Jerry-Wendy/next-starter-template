"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";

export async function addMarketingCost(formData: FormData) {
  const supabase = await createClient();

  const businessId = String(formData.get("business_id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const incurredDate = String(formData.get("incurred_date") ?? "");

  if (!description || !category || !incurredDate || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Please complete all required marketing cost fields.");
  }

  const { error } = await supabase.from("marketing_costs").insert({
    business_id: businessId || null,
    description,
    category,
    amount,
    incurred_date: incurredDate,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/roi");
}

export async function addAttributedRevenue(formData: FormData) {
  const supabase = await createClient();

  const businessId = String(formData.get("business_id") ?? "");
  const amount = Number(formData.get("attributed_revenue"));

  if (!businessId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Please select a business and enter a valid revenue amount.");
  }

  const { error } = await supabase.from("revenue_attribution").insert({
    business_id: businessId,
    attributed_revenue: amount,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/roi");
}
export async function deleteMarketingCost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("marketing_costs")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Could not delete marketing cost: ${error.message}`);
  }

  revalidatePath("/roi");
}


export async function updateMarketingCost(id: string, formData: FormData) {
  const supabase = await createClient();

  const businessId = String(formData.get("business_id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const incurredDate = String(formData.get("incurred_date") ?? "");

  if (!id || !description || !category || !incurredDate ||
      !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Please complete all required marketing cost fields.");
  }

  const { error } = await supabase
    .from("marketing_costs")
    .update({
      business_id: businessId || null,
      description,
      category,
      amount,
      incurred_date: incurredDate,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update marketing cost: ${error.message}`);
  }

  revalidatePath("/roi");
}


export async function deleteAttributedRevenue(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("revenue_attribution")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Could not delete attributed revenue: ${error.message}`
    );
  }

  revalidatePath("/roi");
}
export async function updateAttributedRevenue(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  const businessId = String(formData.get("business_id") ?? "");
  const amount = Number(formData.get("attributed_revenue"));

  if (!businessId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Please select a business and enter a valid revenue amount.");
  }

  const { error } = await supabase
    .from("revenue_attribution")
    .update({
      business_id: businessId,
      attributed_revenue: amount,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update revenue: ${error.message}`);
  }

  revalidatePath("/roi");
}