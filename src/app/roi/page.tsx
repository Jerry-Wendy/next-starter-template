import Link from "next/link";
import { createClient } from "../lib/supabase/server";

export default async function ROIPage() {
  const supabase = await createClient();

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
