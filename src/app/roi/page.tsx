import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import { addMarketingCost, addAttributedRevenue } from "./actions";

export default async function ROIPage() {
  const supabase = await createClient();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name")
    .order("name");

  const { data: costs } = await supabase
    .from("marketing_costs")
    .select("amount");

  const { data: revenue } = await supabase
    .from("revenue_attribution")
    .select("*");

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
            ROI Overview
          </h2>
          <p className="mt-2 text-slate-500">
            As marketing costs and attributed sales are entered into the CRM,
            this page will automatically calculate your results.
          </p>
        </div>
      </div>
    </main>
  );
}
