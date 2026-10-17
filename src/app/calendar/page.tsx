import { createClient } from "../lib/supabase/server";
import Link from "next/link";
export default async function CalendarPage() {
      const supabase = await createClient();
      const { data: visits, error: visitsError } = await supabase
  .from("visits")
  .select("id, visit_date, status, notes")
  .eq("status", "Planned")
  .order("visit_date", { ascending: true });

if (visitsError) {
  throw new Error(`Could not load visits: ${visitsError.message}`);
}
const { data: followups, error: followupsError } = await supabase
  .from("followups")
  .select("id, due_date, status, priority, notes")
  .eq("status", "Open")
  .order("due_date", { ascending: true });

if (followupsError) {
  throw new Error(`Could not load follow-ups: ${followupsError.message}`);
}
const scheduledVisits = visits ?? [];
const openFollowups = followups ?? [];

const totalEvents = scheduledVisits.length + openFollowups.length;
const floridaDate = (value: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const firstDayOfMonth = new Date(year, month, 1);
const daysInMonth = new Date(year, month + 1, 0).getDate();
const startingDay = firstDayOfMonth.getDay();
const calendarDays = [
  ...Array.from({ length: startingDay }, () => null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
];
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Calendar
        </h1>

        <p className="mt-2 text-slate-500">
          Your scheduled visits and follow-ups in one place.
        </p>
        <p className="mt-4 text-sm font-semibold text-blue-700">
  {totalEvents} upcoming calendar events
</p>
      </div>
      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-slate-900">
  {firstDayOfMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}
</h2>
  <p className="mt-2 text-sm text-slate-500">
    Scheduled visits and follow-ups will appear here.
  </p>
  <div className="mt-6 grid grid-cols-7 gap-2">
  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
    <div
      key={day}
      className="py-2 text-center text-sm font-semibold text-slate-600"
    >
      {day}
    </div>
  ))}
</div>
<div className="grid grid-cols-7 gap-2">
  {calendarDays.map((day, index) => {
  const dateKey =
    day === null
      ? ""
      : `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const dayVisits = scheduledVisits.filter(
    (visit) => visit.visit_date && floridaDate(visit.visit_date) === dateKey
  );
const dayFollowups = openFollowups.filter(
  (followup) => followup.due_date === dateKey
);
  return (
    <div
      key={index}
      className="min-h-24 rounded-lg border border-slate-200 bg-white p-2"
    >
      {day !== null && (
        <span className="text-sm font-semibold text-slate-800">
          {day}
        </span>
      )}
      {dayVisits.map((visit) => (
  <div
    key={visit.id}
    className="mt-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
  >
    {new Date(visit.visit_date).toLocaleTimeString("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
})} - Scheduled Visit
  </div>
))}
{dayFollowups.map((followup) => (
  <div
    key={followup.id}
    className="mt-1 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800"
  >
    Follow-Up
  </div>
))}
    </div>
    );
})}
</div>
</section>
    </main>
  );
}