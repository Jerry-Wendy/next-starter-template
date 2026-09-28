"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";

export async function addMarketingCost(formData: FormData) {
  const supabase = await createClient();

  const businessId = String(formData.get("business_id") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  const incurredDate = String(formData.get("incurred_date") || "").trim();

  if (!description || !category || amount <= 0 || !incurredDate) {
    throw new Error("Please complete all required marketing cost fields.");
  }

  const { error } = await supabase.from("marketing_costs").insert({
    business_id: businessId || null,
    description,
    category,
    amount,
    incurred_date: incurredDate,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/roi");
}
