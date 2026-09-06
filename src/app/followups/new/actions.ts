"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function saveFollowUp(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessName = String(formData.get("business") || "").trim();
  const contactName = String(formData.get("contact") || "").trim();
  const dueDate = String(formData.get("due_date") || "").trim();
  const priority = String(formData.get("priority") || "Normal").trim();
  const status = String(formData.get("status") || "Open").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!dueDate) {
    throw new Error("Due date is required.");
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

  const { error } = await supabase.from("followups").insert({
    business_id: businessId,
    contact_id: contactId,
    due_date: dueDate,
    priority,
    status,
    notes: notes || null,
  });

  if (error) {
    throw new Error(`Could not save follow-up: ${error.message}`);
  }

  redirect("/followups");
}
