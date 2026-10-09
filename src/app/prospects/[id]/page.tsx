import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prospect, error } = await supabase
    .from("businesses")
    .select("id, name, industry, relationship_status, next_follow_up")
    .eq("id", id)
    .single();

  if (error || !prospect) {
    notFound();
  }
const { data: contacts, error: contactsError } = await supabase
  .from("contacts")
  .select(
    "id, business_id, name, title, email, phone, preferred_contact_method, notes"
  )
  .eq("business_id", id)
  .order("created_at", { ascending: true });

if (contactsError) {
  throw new Error(`Could not load contacts: ${contactsError.message}`);
}
const { data: followupNotes, error: followupNotesError } =
  await supabase
    .from("followups")
    .select("id, due_date, status, priority, notes")
    .eq("business_id", id)
    .order("due_date", { ascending: false });

if (followupNotesError) {
  throw new Error(
    `Could not load follow-up notes: ${followupNotesError.message}`
  );
}
const { data: savedCatalogs, error: catalogsError } = await supabase
  .from("saved_catalogs")
  .select("id, catalog_name, product_ids, created_at, business_id")
  .eq("business_id", id)
  .order("created_at", { ascending: false });

if (catalogsError) {
  throw new Error(
    `Could not load saved catalogs: ${catalogsError.message}`
  );
}
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/prospects"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Prospects
          </Link>

          <div className="mt-5 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {prospect.name}
              </h1>

              <p className="mt-2 text-lg text-slate-500">
                {prospect.industry || "Business"}
              </p>
            </div>

            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
              {prospect.relationship_status || "Prospect"}
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Prospect Overview</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Business</p>
                <p className="font-medium">{prospect.name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Industry</p>
                <p className="font-medium">
                  {prospect.industry || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Next Follow-Up</p>
                <p className="font-medium">
                  {prospect.next_follow_up || "No follow-up scheduled"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Actions</h2>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={`/visit?business_id=${prospect.id}`}
                className="rounded-lg bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
              >
                Plan Visit
              </Link>

              <Link
                href={`/catalog/builder?business_id=${prospect.id}`}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
              >
                Build Prospect Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-8">
  <div className="rounded-2xl border bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Contacts</h2>
        <p className="mt-1 text-sm text-slate-500">
          People associated with this prospect
        </p>
      </div>

      <Link
        href={`/contacts/new?business_id=${prospect.id}`}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        + Add Contact
      </Link>
    </div>

    <div className="mt-5 space-y-3">
      {contacts && contacts.length > 0 ? (
        contacts.map((contact) => (
          <div
            key={contact.id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="font-semibold">{contact.name}</div>

            {contact.title && (
              <div className="text-sm text-slate-500">{contact.title}</div>
            )}

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {contact.phone && <span>{contact.phone}</span>}
              {contact.email && <span>{contact.email}</span>}
            </div>

            {contact.notes && (
              <div className="mt-2 text-sm text-slate-500">
                {contact.notes}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
          No contacts added yet.
        </div>
      )}
    </div>
  </div>

<div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
  <div className="mb-5 flex items-center justify-between">
    <h2 className="text-lg font-semibold">
      Notes &amp; Follow-Ups
    </h2>
    <Link
      href="/followups/new"
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
    >
      + Add Follow-Up
    </Link>
  </div>

  {followupNotes && followupNotes.length > 0 ? (
    <div className="space-y-3">
      {followupNotes.map((note) => (
        <div
          key={note.id}
          className="rounded-xl border border-slate-200 p-4"
        >
          <div className="mb-2 flex flex-wrap gap-4 text-sm text-slate-500">
            <span>Date: {note.due_date || "—"}</span>
            <span>Status: {note.status || "Open"}</span>
            <span>Priority: {note.priority || "Normal"}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-slate-800">
            {note.notes || "No note entered."}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-slate-500">
      No follow-up notes for this prospect yet.
    </p>
  )}
</div>
<div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="mb-4 text-xl font-bold text-slate-900">
    Saved Catalogs
  </h2>

  {!savedCatalogs || savedCatalogs.length === 0 ? (
    <p className="text-sm text-slate-500">
      No saved catalogs for this business yet.
    </p>
  ) : (
    <div className="space-y-3">
      {savedCatalogs.map((catalog) => {
        const params = new URLSearchParams();
        params.set("business", id);

        (catalog.product_ids ?? []).forEach((productId: string) => {
          params.append("products", productId);
        });

        return (
          <div
            key={catalog.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {catalog.catalog_name}
              </p>
              <p className="text-sm text-slate-500">
                {(catalog.product_ids ?? []).length} products
                {" • "}
                {new Date(catalog.created_at).toLocaleDateString()}
              </p>
            </div>

            <Link
              href={`/catalog/prospect?${params.toString()}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Open Catalog
            </Link>
          </div>
        );
      })}
    </div>
  )}
</div>
</section>
    </main>
  );
}