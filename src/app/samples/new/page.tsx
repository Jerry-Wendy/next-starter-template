import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { addSample } from "./actions";

export default async function NewSamplePage() {
  const supabase = await createClient();

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      wholesale_cost,
      product_colors(
        color_id,
        colors(id, name)
      )
    `)
    .eq("active", true)
    .order("name");

  if (productsError) {
    throw new Error(`Could not load products: ${productsError.message}`);
  }

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
              Product *
            </label>
            <select
              name="product_id"
              required
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Select product</option>
              {(products ?? []).map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Color
            </label>
            <select
              name="color_id"
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Select color</option>
              {(products ?? []).flatMap((product) =>
                (product.product_colors ?? []).map((pc: any) => (
                  <option
                    key={`${product.id}-${pc.color_id}`}
                    value={pc.color_id}
                  >
                    {product.name} — {pc.colors?.name ?? "Color"}
                  </option>
                ))
              )}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Choose a color listed for the selected product.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sample Notes
            </label>
            <input
              name="sample_description"
              placeholder="Optional notes about this sample"
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
