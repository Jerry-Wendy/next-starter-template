import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";

export default async function OpportunitiesPage() {
  const supabase = await createClient();

  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select(`
      id,
      title,
      products_discussed,
      estimated_value,
      quote_status,
      probability,
      follow_up_date,
      notes,
      businesses (
        name
      )
    `)
    .order("follow_up_date", { ascending: true });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Opportunities</h1>
        <p className="mt-4 text-red-600">
          Error loading opportunities: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="mt-1 text-gray-600">
            Track quotes and potential sales.
          </p>
        </div>

        <Link
          href="/opportunities/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          + Add Opportunity
        </Link>
      </div>

      {!opportunities || opportunities.length === 0 ? (
        <div className="rounded border p-6">
          No opportunities yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">Business</th>
                <th className="p-3">Opportunity</th>
                <th className="p-3">Products</th>
                <th className="p-3">Est. Value</th>
                <th className="p-3">Status</th>
                <th className="p-3">Probability</th>
                <th className="p-3">Follow-Up</th>
              </tr>
            </thead>

            <tbody>
              {opportunities.map((opportunity: any) => (
                <tr key={opportunity.id} className="border-b">
                  <td className="p-3">
                    {opportunity.businesses?.name ?? "—"}
                  </td>
                  <td className="p-3 font-medium">
                    {opportunity.title}
                  </td>
                  <td className="p-3">
                    {opportunity.products_discussed || "—"}
                  </td>
                  <td className="p-3">
                    {opportunity.estimated_value != null
                      ? `$${Number(opportunity.estimated_value).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="p-3">
                    {opportunity.quote_status || "—"}
                  </td>
                  <td className="p-3">
                    {opportunity.probability != null
                      ? `${opportunity.probability}%`
                      : "—"}
                  </td>
                  <td className="p-3">
                    {opportunity.follow_up_date || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link href="/" className="underline">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
