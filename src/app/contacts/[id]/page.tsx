import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contact, error } = await supabase
    .from("contacts")
    .select(
      "id, business_id, name, title, email, phone, preferred_contact_method, notes"
    )
    .eq("id", id)
    .single();

  if (error || !contact) {
    notFound();
  }

  let businessName = "No business assigned";
  let businessId = contact.business_id;

  if (businessId) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("id", businessId)
      .single();

    if (business) {
      businessName = business.name;
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <Link
                href="/contacts"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                ← Back to Contacts
              </Link>

              <h1 className="mt-4 text-3xl font-bold tracking-tight">
                {contact.name}
              </h1>

              <p className="mt-2 text-lg text-slate-500">{businessName}</p>
            </div>

            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Contact Information</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium">{contact.name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Business</p>
                <p className="font-medium">{businessName}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="font-medium">
                  {contact.title || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium">
                  {contact.phone || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">
                  {contact.email || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Preferred Contact Method</p>
                <p className="font-medium">
                  {contact.preferred_contact_method || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Notes</h2>

            <p className="mt-5 whitespace-pre-wrap text-slate-700">
              {contact.notes || "No notes have been added."}
            </p>

            {businessId && (
              <div className="mt-8">
                <Link
                  href={`/prospects/${businessId}`}
                  className="block rounded-lg bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-700"
                >
                  View Prospect
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}