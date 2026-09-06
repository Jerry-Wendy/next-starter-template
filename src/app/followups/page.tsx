import Link from "next/link";
import { createClient } from "../lib/supabase/server";

export default async function FollowUpsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("followups")
    .select(`
      id,
      due_date,
      status,
      priority,
      notes,
      completed_at,
      businesses (
        name
      ),
      contacts (
        name
      )
    `)
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(`Could not load follow-ups: ${error.message}`);
  }

  const followups = (data ?? []).map((item) => ({
    id: item.id,
    business: item.businesses?.[0]?.name || "—",
    contact: item.contacts?.[0]?.name || "—",
    dueDate: item.due_date || "—",
    status: item.status || "Open",
    priority: item.priority || "Normal",
    notes: item.notes || "—",
  }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Follow-Ups</h1>
            <p className="mt-1 text-sm text-slate-500">
              Keep track of who needs attention and when
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
            <h2 className="text-lg font-semibold">Follow-Ups</h2>
            <p className="text-sm text-slate-500">
              {followups.length} follow-ups currently listed
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add Follow-Up
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {followups.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold">{item.business}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.contact}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.dueDate}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.priority}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.status}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
