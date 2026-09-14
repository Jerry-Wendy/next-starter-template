import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { updateOpportunity } from "./actions";

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: opportunity, error: opportunityError }, { data: businesses, error: businessesError }] =
    await Promise.all([
      supabase
        .from("opportunities")
        .select(`
          id,
          business_id,
          title,
          products_discussed,
          estimated_value,
          quote_status,
          probability,
          follow_up_date,
          notes
        `)
        .eq("id", id)
        .single(),

      supabase
        .from("businesses")
        .select("id, name")
        .order("name", { ascending: true }),
    ]);

  if (opportunityError || !opportunity) {
    notFound();
  }

  if (businessesError) {
    throw new Error(businessesError.message);
  }

  const updateAction = updateOpportunity.bind(null, id);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Opportunity</h1>
        <p className="mt-1 text-gray-600">
          Update quote and sales progress.
        </p>
      </div>

      <form action={updateAction} className="space-y-5">
        <div>
          <label className="mb-1 block font-medium">Business *</label>
          <select
            name="business_id"
            required
            defaultValue={opportunity.business_id}
            className="w-full rounded border px-3 py-2"
          >
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
            defaultValue={opportunity.title ?? ""}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Products Discussed
          </label>
          <input
            name="products_discussed"
            defaultValue={opportunity.products_discussed ?? ""}
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
            defaultValue={opportunity.estimated_value ?? ""}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Quote Status</label>
          <select
            name="quote_status"
            defaultValue={opportunity.quote_status ?? "Open"}
            className="w-full rounded border px-3 py-2"
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
            defaultValue={opportunity.probability ?? ""}
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
            defaultValue={opportunity.follow_up_date ?? ""}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Notes</label>
          <textarea
            name="notes"
            rows={5}
            defaultValue={opportunity.notes ?? ""}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Save Changes
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
