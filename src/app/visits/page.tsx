import Link from "next/link";
import { createClient } from "../lib/supabase/server";

export default async function VisitsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .order("visit_date", { ascending: true });

  if (error) {
    throw new Error(`Could not load visits: ${error.message}`);
  }

  const visits = (data ?? []).map((item) => ({
    id: item.id,
    business: (item.businesses as any)?.name || "—",
    contact: (item.contacts as any)?.name || "—",
    visitDate: item.visit_date || "—",
    status: item.status || "Planned",
    notes: item.notes || "—",
  }));
const today = new Date();

const calendarYear = today.getFullYear();
const calendarMonth = today.getMonth();

const monthName = today.toLocaleString("default", {
  month: "long",
});

const firstDayOfMonth = new Date(
  calendarYear,
  calendarMonth,
  1
).getDay();

const daysInMonth = new Date(
  calendarYear,
  calendarMonth + 1,
  0
).getDate();

const calendarDays = [
  ...Array(firstDayOfMonth).fill(null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
];
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold">Visit Planner</h1>
            <p className="mt-1 text-slate-500">
  Plan, schedule and manage customer visits
</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/visits/new"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white"
            >
              + Plan Visit
            </Link>

            <Link
              href="/"
              className="rounded-lg border px-5 py-2.5 font-medium"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Visits</h2>
          <p className="mt-1 text-slate-500">
            {visits.length} visit{visits.length === 1 ? "" : "s"} currently listed
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Visit Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {visits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold">{item.business}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.contact}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">
  {new Date(item.visitDate).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}
</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.status}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<div className="mt-10">
  <div className="mb-5">
    <h2 className="text-2xl font-bold">{monthName} {calendarYear}</h2>
    <p className="mt-1 text-slate-500">
      Scheduled visits at a glance
    </p>
  </div>

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
    <div className="grid grid-cols-7 border-b bg-slate-50">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          {day}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7">
      {calendarDays.map((day, index) => {
        const dayVisits = day
          ? visits.filter((visit) => {
              const visitDate = new Date(visit.visitDate);
              return (
                visitDate.getFullYear() === calendarYear &&
                visitDate.getMonth() === calendarMonth &&
                visitDate.getDate() === day
              );
            })
          : [];

        return (
          <div
            key={index}
            className="min-h-28 border-b border-r p-3"
          >
            {day && (
              <>
                <div className="mb-2 text-sm font-semibold text-slate-700">
                  {day}
                </div>

                <div className="space-y-1">
                  {dayVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="rounded-lg bg-slate-900 px-2 py-1.5 text-xs text-white"
                    ><div className="text-slate-300">
  {new Date(visit.visitDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}
</div>
                      <div className="font-semibold">{visit.business}</div>
                      {visit.contact !== "—" && (
                        <div className="text-slate-300">{visit.contact}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  </div>
</div>

      </section>
    </main>
  );
}
