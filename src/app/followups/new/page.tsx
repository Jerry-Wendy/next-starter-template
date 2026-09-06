import Link from "next/link";
import { saveFollowUp } from "./actions";

export default function NewFollowUpPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold">Add Follow-Up</h1>
            <p className="mt-1 text-slate-500">
              Schedule the next action for a business or contact
            </p>
          </div>

          <Link
            href="/followups"
            className="rounded-lg border px-5 py-2.5 font-medium"
          >
            ← Follow-Ups
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <form action={saveFollowUp}>
          <div className="grid gap-6 sm:grid-cols-2">

            <label className="block">
              <span className="text-sm font-semibold">Business</span>
              <input
                type="text"
                name="business"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Business name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Contact</span>
              <input
                type="text"
                name="contact"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Contact name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Due Date *</span>
              <input
                type="date"
                name="due_date"
                required
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Priority</span>
              <select
                name="priority"
                defaultValue="Normal"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
              >
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Status</span>
              <select
                name="status"
                defaultValue="Open"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
              >
                <option>Open</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Notes</span>
              <textarea
                name="notes"
                rows={5}
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="What needs to happen next?"
              />
            </label>

          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/followups"
              className="rounded-lg border px-5 py-2.5 font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white"
            >
              Save Follow-Up
            </button>
          </div>
        </form>
        </div>
      </section>
    </main>
  );
}
