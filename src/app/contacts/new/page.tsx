import Link from "next/link";
import { saveContact } from "./actions";

export default function NewContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Contact</h1>
            <p className="mt-1 text-sm text-slate-500">
              Add a person connected to a prospect or customer
            </p>
          </div>

          <Link
            href="/contacts"
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Contacts
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <form action={saveContact}>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">Contact Name *</span>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                name="name"
                required
                placeholder="Full name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Business</span>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                name="business"
                placeholder="Business name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Role / Title</span>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                name="title"
                placeholder="Manager, Owner, Buyer..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Phone</span>
              <input
                type="tel"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                name="phone"
                placeholder="Phone number"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Email</span>
              <input
                type="email"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                name="email"
                placeholder="Email address"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Notes</span>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                name="notes"
              placeholder="Relationship notes, preferences, follow-up details..."
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/contacts"
              className="rounded-lg border px-5 py-2.5 font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white"
            >
              Save Contact
            </button>
          </div>
        </form>
        </div>
      </section>
    </main>
  );
}
