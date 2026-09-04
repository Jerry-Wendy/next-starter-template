"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function saveProspect(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessName = String(formData.get("business_name") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  const contactName = String(formData.get("contact_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!businessName) {
    throw new Error("Business name is required.");
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .insert({
      name: businessName,
      industry: industry || null,
      phone: phone || null,
      relationship_status: "Prospect",
      priority: "Normal",
      notes: notes || null,
    })
    .select("id")
    .single();

  if (businessError) {
    throw new Error(`Could not save prospect: ${businessError.message}`);
  }

  if (contactName || email) {
    const { error: contactError } = await supabase.from("contacts").insert({
      business_id: business.id,
      name: contactName || email,
      email: email || null,
      phone: phone || null,
      notes: notes || null,
    });

    if (contactError) {
      throw new Error(`Prospect saved, but contact failed: ${contactError.message}`);
    }
  }

  redirect("/prospects");
}
