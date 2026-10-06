import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { updateVisit } from "../../new/actions";

export default async function EditVisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: visit, error } = await supabase
    .from("visits")
    .select(`
      id,
      visit_date,
      status,
      notes,
      businesses (
        name
      ),
      contacts (
        name
      )
    `)
    .eq("id", id)
    .single();

  if (error || !visit) {
    notFound();
  }

  const businessName = (visit.businesses as any)?.name || "—";
  const contactName = (visit.contacts as any)?.name || "—";

  const visitDate = new Date(visit.visit_date);

  const year = visitDate.getFullYear();
  const month = String(visitDate.getMonth() + 1).padStart(2, "0");
  const day = String(visitDate.getDate()).padStart(2, "0");
  const hours = String(visitDate.getHours()).padStart(2, "0");
  const minutes = String(visitDate.getMinutes()).padStart(2, "0");

  const dateTimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;

  const updateThisVisit = updateVisit.bind(null, id);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Visit</h1>
            <p className="mt-1 text-slate-500">
              Reschedule or update this appointment
            </p>
          </div>

          <Link
            href="/visits"
            className="rounded-xl border px-5 py-3 font-semibold hover:bg-slate-50"
          >
            ← Visit Planner
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-500">BUSINESS</p>
              <p className="mt-1 text-lg font-semibold">{businessName}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">CONTACT</p>
              <p className="mt-1 text-lg font-semibold">{contactName}</p>
            </div>
          </div>

          <form action={updateThisVisit} className="space-y-6">
            <div>
              <label
                htmlFor="visit_date"
                className="mb-2 block font-semibold"
              >
                Visit Date & Time
              </label>

              <input
                id="visit_date"
                name="visit_date"
                type="datetime-local"
                defaultValue={dateTimeValue}
                required
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="status" className="mb-2 block font-semibold">
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={visit.status || "Planned"}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="Planned">Planned</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="mb-2 block font-semibold">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                defaultValue={visit.notes || ""}
                rows={5}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/visits"
                className="rounded-xl border px-5 py-3 font-semibold hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}