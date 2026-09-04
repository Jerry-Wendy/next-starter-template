"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function saveContact(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") || "").trim();
  const businessName = String(formData.get("business") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!name) {
    throw new Error("Contact name is required.");
  }

  let businessId: string | null = null;

  if (businessName) {
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("name", businessName)
      .maybeSingle();

    if (businessError) {
      throw new Error(`Could not find business: ${businessError.message}`);
    }

    businessId = business?.id ?? null;
  }

  const { error } = await supabase.from("contacts").insert({
    business_id: businessId,
    name,
    title: title || null,
    phone: phone || null,
    email: email || null,
    notes: notes || null,
  });

  if (error) {
    throw new Error(`Could not save contact: ${error.message}`);
  }

  redirect("/contacts");
}
