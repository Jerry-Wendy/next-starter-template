import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import {
  addMarketingCost,
  addAttributedRevenue,
} from "./actions";
import DeleteMarketingCostButton from "./DeleteMarketingCostButton";
import DeleteRevenueButton from "./DeleteRevenueButton";
import EditMarketingCostButton from "./EditMarketingCostButton";
export default async function ROIPage() {
  const supabase = await createClient();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name")
    .order("name");

  const { data: costs } = await supabase
    .from("marketing_costs")
    .select("id, business_id, description, category, amount, incurred_date, created_at")
    .order("created_at", { ascending: false });

  const { data: revenue } = await supabase
    .from("revenue_attribution")
    .select("*")
    .order("created_at", { ascending: false });

  const totalCost = (costs ?? []).reduce(
    (sum, row) => sum + Number(row.amount ?? 0),
    0
  );

  const totalRevenue = (revenue ?? []).reduce((sum, row) => {
    const value =
      row.revenue_amount ??
      row.amount ??
      row.revenue ??
      row.attributed_revenue ??
      0;

    return sum + Number(value);
  }, 0);

  const profit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const businessROI = (businesses ?? [])
    .map((business) => {
      const businessCost = (costs ?? [])
        .filter((row) => row.business_id === business.id)
        .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

      const businessRevenue = (revenue ?? [])
        .filter((row) => row.business_id === business.id)
        .reduce(
          (sum, row) => sum + Number(row.attributed_revenue ?? 0),
          0
        );

      const businessReturn = businessRevenue - businessCost;
      const businessRoi =
        businessCost > 0 ? (businessReturn / businessCost) * 100 : null;

      return {
        id: business.id,
        name: business.name,
        cost: businessCost,
        revenue: businessRevenue,
        returnAmount: businessReturn,
        roi: businessRoi,
      };
    })
    .filter((business) => business.cost > 0 || business.revenue > 0);

  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-slate-600 underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Marketing ROI
          </h1>
          <p className="mt-2 text-slate-500">
            Track marketing spending, attributed revenue and return on investment.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Marketing Spend
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {money(totalCost)}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Attributed Revenue
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {money(totalRevenue)}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Return
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {money(profit)}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              ROI
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {roi.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Add Marketing Cost
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Record expenses related to prospecting, samples, advertising and sales activity.
          </p>

          <form action={addMarketingCost} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Business
              </label>
              <select
                name="business_id"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="">General / No Business</option>
                {(businesses ?? []).map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <input
                name="description"
                required
                placeholder="Sample, ad, travel..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                name="category"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="" disabled>Select category</option>
                <option value="Samples">Samples</option>
                <option value="Advertising">Advertising</option>
                <option value="Travel / Mileage">Travel / Mileage</option>
                <option value="Events">Events</option>
                <option value="Promotional Materials">Promotional Materials</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Amount
              </label>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                name="incurred_date"
                type="date"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-5">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700"
              >
                Add Marketing Cost
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Add Attributed Revenue
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Record revenue generated from a business or prospect.
          </p>

          <form action={addAttributedRevenue} className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Business
              </label>
              <select
                name="business_id"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="" disabled>Select business</option>
                {(businesses ?? []).map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Revenue Amount
              </label>
              <input
                name="attributed_revenue"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700"
              >
                Add Revenue
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            ROI by Client / Prospect
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            See what has gone out, what has come back in, and the return for each business.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Client / Prospect</th>
                  <th className="pb-3 pr-4 text-right">Marketing Out</th>
                  <th className="pb-3 pr-4 text-right">Revenue In</th>
                  <th className="pb-3 pr-4 text-right">Return</th>
                  <th className="pb-3 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {businessROI.map((business) => (
                  <tr key={business.id}>
                    <td className="py-3 pr-4 font-medium">
                      {business.name}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      {money(business.cost)}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      {money(business.revenue)}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      {money(business.returnAmount)}
                    </td>
                    <td className="py-3 text-right">
                      {business.roi === null
                        ? "—"
                        : `${business.roi.toFixed(1)}%`}
                    </td>
                  </tr>
                ))}

                {businessROI.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No client ROI activity recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent ROI Activity
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Recent marketing expenses and attributed revenue recorded in the CRM.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Business</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(costs ?? []).map((item) => {
                  const business = (businesses ?? []).find(
                    (b) => b.id === item.business_id
                  );

                  return (
                    <tr key={`cost-${item.id}`}>
                      <td className="py-3 pr-4 font-medium">Marketing Cost</td>
                      <td className="py-3 pr-4">{business?.name ?? "General"}</td>
                      <td className="py-3 pr-4">
                        {item.description}
                        {item.category ? ` — ${item.category}` : ""}
                      </td>
                      <td className="py-3 pr-4">{item.incurred_date ?? "—"}</td>
                      <td className="py-3 text-right">
                        -{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(item.amount ?? 0))}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <EditMarketingCostButton
  id={item.id}
  businessId={item.business_id}
  description={item.description}
  category={item.category}
  amount={item.amount}
  incurredDate={item.incurred_date}
  businesses={businesses ?? []}
/>
  <DeleteMarketingCostButton id={item.id} />
</td>
                    </tr>
                  );
                })}

                {(revenue ?? []).map((item) => {
                  const business = (businesses ?? []).find(
                    (b) => b.id === item.business_id
                  );

                  return (
                    <tr key={`revenue-${item.id}`}>
                      <td className="py-3 pr-4 font-medium">Revenue</td>
                      <td className="py-3 pr-4">{business?.name ?? "—"}</td>
                      <td className="py-3 pr-4">Attributed Revenue</td>
                      <td className="py-3 pr-4">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 text-right">
                        +{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(item.attributed_revenue ?? 0))}
                      </td>
                    <td className="py-3 pl-4 text-right">
  <DeleteRevenueButton id={item.id} />
</td>  
                    </tr>
                  );
                })}

                {(costs ?? []).length === 0 && (revenue ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No ROI activity recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
