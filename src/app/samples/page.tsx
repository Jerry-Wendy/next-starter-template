import Link from "next/link";
import { createClient } from "../lib/supabase/server";

export default async function SamplesPage() {
  const supabase = await createClient();

  const { data: samples, error } = await supabase
    .from("samples")
    .select(`
      id,
      sample_description,
      internal_cost,
      engraving_cost,
      date_given,
      result,
      businesses(name)
    `)
    .order("date_given", { ascending: false });

  if (error) {
    throw new Error(`Could not load samples: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Samples</h1>
            <p className="mt-1 text-slate-500">
              Track samples given to prospects and customers
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Dashboard
            </Link>

            <Link
              href="/samples/new"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              + Add Sample
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-sm text-slate-600">
              <tr>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Sample</th>
                <th className="px-5 py-3">Date Given</th>
                <th className="px-5 py-3">Internal Cost</th>
                <th className="px-5 py-3">Engraving</th>
                <th className="px-5 py-3">Result</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(samples ?? []).map((sample) => {
                const business = (sample.businesses as any)?.name ?? "—";

                return (
                  <tr key={sample.id} className="text-sm text-slate-700">
                    <td className="px-5 py-4 font-medium">{business}</td>
                    <td className="px-5 py-4">{sample.sample_description || "—"}</td>
                    <td className="px-5 py-4">{sample.date_given || "—"}</td>
                    <td className="px-5 py-4">
                      {sample.internal_cost != null
                        ? `$${Number(sample.internal_cost).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {sample.engraving_cost != null
                        ? `$${Number(sample.engraving_cost).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4">{sample.result || "—"}</td>
                  </tr>
                );
              })}

              {(samples ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                    No samples recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
