import { createClient } from "../../lib/supabase/server";

export default async function ProspectCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    business?: string;
    products?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const businessId = params.business;
  const productParam = params.products;

  const productIds = Array.isArray(productParam)
    ? productParam
    : productParam
      ? [productParam]
      : [];

  const { data: business } = businessId
    ? await supabase
        .from("businesses")
        .select("id, name")
        .eq("id", businessId)
        .single()
    : { data: null };

  const { data: products, error } =
    productIds.length > 0
      ? await supabase
          .from("products")
          .select(`
            id,
            name,
            customer_description,
            customer_image_url,
            catalog_category,
            local_only,
            retail_price,
            product_pricing_tiers (
              min_quantity,
              max_quantity,
              unit_price,
              price_label,
              sort_order
            )
          `)
          .in("id", productIds)
      : { data: [], error: null };

  if (error) {
    throw new Error(`Could not load prospect catalog: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Lillian Harper Designs
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Product Recommendations
          </h1>

          {business?.name && (
            <p className="mt-2 text-xl text-slate-600">
              Prepared for {business.name}
            </p>
          )}
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {(products ?? []).map((product: any) => {
            const tiers = [...(product.product_pricing_tiers ?? [])].sort(
              (a: any, b: any) =>
                (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
                a.min_quantity - b.min_quantity
            );

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex h-64 items-center justify-center bg-slate-100 p-4">
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

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {product.catalog_category || "Product"}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {product.name}
                  </h2>

                  {product.customer_description && (
                    <p className="mt-3 text-slate-600">
                      {product.customer_description}
                    </p>
                  )}

                  {product.local_only && tiers.length > 0 ? (
                    <div className="mt-5">
                      <p className="font-semibold text-slate-900">
                        Quantity Pricing
                      </p>

                      <div className="mt-2 space-y-1">
                        {tiers.map((tier: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm text-slate-700"
                          >
                            <span>
                              {tier.price_label ||
                                (tier.max_quantity
                                  ? `${tier.min_quantity}–${tier.max_quantity}`
                                  : `${tier.min_quantity}+`)}
                            </span>
                            <span>
                              ${Number(tier.unit_price).toFixed(2)}
                            </span>
                          </div>
                        ))}
              {tiers.length > 0 && tiers[tiers.length - 1].max_quantity != null && (
                <div className="flex justify-between text-sm font-semibold text-slate-700">
                  <span>{tiers[tiers.length - 1].max_quantity + 1}+</span>
                  <span>Contact Us</span>
                </div>
              )}
                      </div>
                    </div>
                  ) : product.retail_price != null ? (
                    <div className="mt-5">
                      <p className="text-xl font-bold text-slate-900">
                        ${Number(product.retail_price).toFixed(2)}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Bulk orders: Contact us for pricing.
                      </p>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          Lillian Harper Designs • Custom Laser Engraving
        </footer>
      </div>
    </main>
  );
}
