import Link from "next/link";
import { createClient } from "../lib/supabase/server";

export default async function ProspectsPage() {
  const supabase = await createClient();

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, name, industry, relationship_status, next_follow_up")
    .eq("relationship_status", "Prospect")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load prospects: ${error.message}`);
  }

  const prospects = (businesses ?? []).map((business) => ({
    id: business.id,
    name: business.name,
    industry: business.industry || "—",
    status: business.relationship_status || "Prospect",
    next: business.next_follow_up ? "Follow Up" : "Plan Visit",
  }));
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Prospects</h1>
            <p className="mt-1 text-sm text-slate-500">
              Businesses we want to develop into Lillian Harper customers
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Active Prospects</h2>
            <p className="text-sm text-slate-500">
              {prospects.length} prospects currently being developed
            </p>
          </div>

          <Link href="/prospects/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            + Add Prospect
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Industry</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {prospects.map((prospect) => (
                <tr key={prospect.name} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold">{prospect.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {prospect.industry}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {prospect.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {prospect.next}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
