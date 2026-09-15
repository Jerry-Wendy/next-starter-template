import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

export default async function CatalogBuilderPage() {
  const supabase = await createClient();

  const { data: businesses, error: businessesError } = await supabase
    .from("businesses")
    .select("id, name")
    .order("name", { ascending: true });

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      customer_image_url,
      catalog_category,
      retail_price,
      local_only
    `)
    .eq("show_in_customer_catalog", true)
    .eq("active", true)
    .order("catalog_sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (businessesError) {
    throw new Error(`Could not load businesses: ${businessesError.message}`);
  }

  if (productsError) {
    throw new Error(`Could not load products: ${productsError.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-slate-600 underline">
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Prospect Catalog Builder
          </h1>

          <p className="mt-2 text-slate-600">
            Choose a prospect and the products you want to present.
          </p>
        </div>

        <form action="/catalog/prospect" method="GET">
        <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Prospect / Business
          </label>

          <select
            name="business"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
            defaultValue=""
          >
            <option value="" disabled>
              Select a prospect...
            </option>

            {(businesses ?? []).map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </section>

        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Select Products
            </h2>
            <p className="text-sm text-slate-500">
              Only customer-approved catalog products appear here.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {(products ?? []).length} products available
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(products ?? []).map((product) => (
            <label
              key={product.id}
              className="cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition hover:border-slate-400"
            >
              <div className="flex h-40 items-center justify-center bg-slate-100 p-4">
                {product.customer_image_url ? (
                  <img
                    src={product.customer_image_url}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-slate-400">
                    Product image coming soon
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    name="products"
                    value={product.id}
                    className="mt-1 h-5 w-5"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {product.catalog_category || "Product"}
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {product.name}
                    </p>

                    {product.local_only ? (
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        Local quantity pricing
                      </p>
                    ) : product.retail_price != null ? (
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        ${Number(product.retail_price).toFixed(2)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white"
          >
            Generate Prospect Catalog
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}
