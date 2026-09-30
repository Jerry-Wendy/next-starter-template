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
    </main>
  );
}