import Link from "next/link";
import { addSample } from "./actions";

export default function NewSamplePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/samples"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Samples
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Add Sample
          </h1>

          <p className="mt-1 text-slate-500">
            Record a sample given to a prospect or customer
          </p>
        </div>

        <form
          action={addSample}
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Business *
            </label>
            <input
              name="business"
              required
              placeholder="Exact business name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sample Description
            </label>
            <input
              name="sample_description"
              placeholder="Example: 12oz green wine tumbler"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Internal Cost
              </label>
              <input
                name="internal_cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Engraving Cost
              </label>
              <input
                name="engraving_cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date Given
            </label>
            <input
              name="date_given"
              type="date"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Result
            </label>
            <select
              name="result"
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Select result</option>
              <option value="Pending">Pending</option>
              <option value="Interested">Interested</option>
              <option value="Quote Requested">Quote Requested</option>
              <option value="Ordered">Ordered</option>
              <option value="No Interest">No Interest</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/samples"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
            >
              Save Sample
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
