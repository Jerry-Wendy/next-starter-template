"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export async function updateOpportunity(id: string, formData: FormData) {
  const supabase = await createClient();

  const businessId = String(formData.get("business_id") || "");
  const title = String(formData.get("title") || "").trim();
  const productsDiscussed = String(formData.get("products_discussed") || "").trim();
  const estimatedValueRaw = String(formData.get("estimated_value") || "").trim();
  const quoteStatus = String(formData.get("quote_status") || "").trim();
  const probabilityRaw = String(formData.get("probability") || "").trim();
  const followUpDate = String(formData.get("follow_up_date") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!businessId || !title) {
    throw new Error("Business and Opportunity Title are required.");
  }

  const { error } = await supabase
    .from("opportunities")
    .update({
      business_id: businessId,
      title,
      products_discussed: productsDiscussed || null,
      estimated_value: estimatedValueRaw ? Number(estimatedValueRaw) : null,
      quote_status: quoteStatus || null,
      probability: probabilityRaw ? Number(probabilityRaw) : null,
      follow_up_date: followUpDate || null,
      notes: notes || null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/opportunities");
  revalidatePath("/");
  redirect("/opportunities");
}
