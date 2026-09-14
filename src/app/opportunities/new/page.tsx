import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { createOpportunity } from "./actions";

export default async function NewOpportunityPage() {
  const supabase = await createClient();

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">New Opportunity</h1>
        <p className="mt-4 text-red-600">
          Error loading businesses: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Opportunity</h1>
        <p className="mt-1 text-gray-600">
          Track a quote or potential sale.
        </p>
      </div>

      <form action={createOpportunity} className="space-y-5">
        <div>
          <label className="mb-1 block font-medium">Business *</label>
          <select
            name="business_id"
            required
            className="w-full rounded border px-3 py-2"
            defaultValue=""
          >
            <option value="" disabled>
              Select a business
            </option>
            {businesses?.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Opportunity Title *
          </label>
          <input
            name="title"
            required
            placeholder="Example: 50 employee tumblers"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Products Discussed
          </label>
          <input
            name="products_discussed"
            placeholder="Example: 20oz tumblers, water bottles"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Estimated Value
          </label>
          <input
            name="estimated_value"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Quote Status</label>
          <select
            name="quote_status"
            className="w-full rounded border px-3 py-2"
            defaultValue="Open"
          >
            <option value="Open">Open</option>
            <option value="Quote Needed">Quote Needed</option>
            <option value="Quote Sent">Quote Sent</option>
            <option value="Waiting">Waiting</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Probability %
          </label>
          <input
            name="probability"
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="50"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Follow-Up Date
          </label>
          <input
            name="follow_up_date"
            type="date"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Notes</label>
          <textarea
            name="notes"
            rows={5}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Save Opportunity
          </button>

          <Link
            href="/opportunities"
            className="rounded border px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
