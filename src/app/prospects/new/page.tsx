import Link from "next/link";

export default function NewProspectPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Prospect</h1>
            <p className="mt-1 text-sm text-slate-500">
              Add a business you want to develop into a Lillian Harper customer
            </p>
          </div>

          <Link
            href="/prospects"
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Prospects
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">Business Name *</span>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Business name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Industry</span>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Golf Course, Realtor, Restaurant..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Contact Name</span>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Primary contact"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Phone</span>
              <input
                type="tel"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Phone number"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Email</span>
              <input
                type="email"
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Email address"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Notes</span>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-lg border px-3 py-2.5"
                placeholder="Anything useful about this prospect..."
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/prospects"
              className="rounded-lg border px-5 py-2.5 font-medium"
            >
              Cancel
            </Link>

            <button
              type="button"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white"
            >
              Save Prospect
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
