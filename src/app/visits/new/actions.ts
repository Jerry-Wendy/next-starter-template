"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function saveVisit(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessName = String(formData.get("business") || "").trim();
  const contactName = String(formData.get("contact") || "").trim();
  const visitDate = String(formData.get("visit_date") || "").trim();
  const status = String(formData.get("status") || "Planned").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!visitDate) {
    throw new Error("Visit date is required.");
  }

  let businessId: string | null = null;
  let contactId: string | null = null;

  if (businessName) {
    const { data: business, error } = await supabase
      .from("businesses")
      .select("id")
      .eq("name", businessName)
      .maybeSingle();

    if (error) {
      throw new Error(`Could not find business: ${error.message}`);
    }

    businessId = business?.id ?? null;
  }

  if (contactName) {
    const { data: contact, error } = await supabase
      .from("contacts")
      .select("id")
      .eq("name", contactName)
      .maybeSingle();

    if (error) {
      throw new Error(`Could not find contact: ${error.message}`);
    }

    contactId = contact?.id ?? null;
  }

  const { error } = await supabase.from("visits").insert({
    business_id: businessId,
    contact_id: contactId,
    visit_date: visitDate,
    status,
    notes: notes || null,
  });

  if (error) {
    throw new Error(`Could not save visit: ${error.message}`);
  }

  redirect("/");
}
