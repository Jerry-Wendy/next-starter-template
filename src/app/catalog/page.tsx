import { createClient } from "../lib/supabase/server";

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      customer_description,
      customer_image_url,
      catalog_category,
      catalog_sort_order,
      local_only,
      retail_price,
      product_pricing_tiers (
        id,
        min_quantity,
        max_quantity,
        unit_price,
        price_label,
        sort_order
      )
    `)
    .eq("show_in_customer_catalog", true)
    .eq("active", true)
    .order("catalog_sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Could not load catalog: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <a
            href="/"
            className="mb-4 inline-block text-sm font-medium text-slate-600 underline"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-slate-900">
            Lillian Harper Designs
          </h1>
          <p className="mt-2 text-slate-600">
            Personalized gifts, promotional products and custom laser engraving.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(products ?? []).map((product) => {
            const tiers = [...(product.product_pricing_tiers ?? [])].sort(
              (a, b) =>
                (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
                a.min_quantity - b.min_quantity
            );

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {product.customer_image_url ? (
                  <div className="flex h-64 items-center justify-center bg-white p-4">
                    <img
                      src={product.customer_image_url}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center bg-slate-100 text-sm text-slate-400">
                    Product image coming soon
                  </div>
                )}

                <div className="p-5">
                  {product.catalog_category && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {product.catalog_category}
                    </p>
                  )}

                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  {product.customer_description && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {product.customer_description}
                    </p>
                  )}

                  {product.local_only && tiers.length > 0 ? (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-900">
                        Quantity Pricing
                      </p>

                      <div className="mt-2 space-y-1">
                        {tiers.map((tier) => (
                          <div
                            key={tier.id}
                            className="flex justify-between text-sm text-slate-700"
                          >
                            <span>
                              {tier.min_quantity}
                              {tier.max_quantity
                                ? `–${tier.max_quantity}`
                                : "+"}
                            </span>

                            <span className="font-medium">
                              {tier.unit_price != null
                                ? `$${Number(tier.unit_price).toFixed(2)}`
                                : tier.price_label || "Contact Us"}
                            </span>
                          </div>
                        ))}
                      </div>
                {tiers.length > 0 && tiers[tiers.length - 1].max_quantity != null && (
                  <div className="mt-2 flex justify-between text-sm font-medium text-slate-700">
                    <span>{Number(tiers[tiers.length - 1].max_quantity) + 1}+</span>
                    <a href="mailto:lillianharperinc@gmail.com" className="underline">
                      Contact Us
                    </a>
                  </div>
                )}
                    </div>
                  ) : (
                    <div className="mt-5">
                      {product.retail_price != null && (
                        <p className="text-lg font-semibold text-slate-900">
                          ${Number(product.retail_price).toFixed(2)}
                        </p>
                      )}

                <div className="mt-3 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">
                    Need a larger quantity?
                  </p>
                  <p className="mt-1">
                    Contact us for bulk pricing at{" "}
                    <a
                      href="mailto:lillianharperinc@gmail.com"
                      className="font-medium underline"
                    >
                      lillianharperinc@gmail.com
                    </a>
                  </p>
                </div>
                    </div>
                  )}

                  {product.local_only && (
                    <p className="mt-4 text-xs font-medium text-slate-500">
                      Local availability
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
