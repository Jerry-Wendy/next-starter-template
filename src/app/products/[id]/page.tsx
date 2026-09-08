import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { updateCatalogSettings, updateProductColors } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      category,
      description,
      manufacturer,
      supplier,
      wholesale_cost,
      retail_price,
      additional_engraving_fee,
      availability,
      internal_notes,
      active,
      show_in_customer_catalog,
      local_only,
      customer_description,
      customer_image_url,
      catalog_category,
      catalog_sort_order
    `)
    .eq("id", id)
    .single();

  if (productError || !product) {
    throw new Error(`Could not load product: ${productError?.message || "Not found"}`);
  }

  const { data: colors, error: colorsError } = await supabase
    .from("colors")
    .select("id, name")
    .eq("active", true)
    .order("name");

  if (colorsError) {
    throw new Error(`Could not load colors: ${colorsError.message}`);
  }

  const { data: assignedColors, error: assignedError } = await supabase
    .from("product_colors")
    .select("color_id")
    .eq("product_id", id);

  if (assignedError) {
    throw new Error(`Could not load product colors: ${assignedError.message}`);
  }

  const assignedIds = new Set(
    (assignedColors ?? []).map((item) => item.color_id)
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/products"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Products
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              {product.name}
            </h1>

            <p className="mt-1 text-slate-500">
              Product details and available colors
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Product Information
            </h2>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-slate-500">SKU</dt>
                <dd className="text-slate-900">{product.sku || "—"}</dd>
              </div>

              <div>
                <dt className="font-medium text-slate-500">Category</dt>
                <dd className="text-slate-900">{product.category || "—"}</dd>
              </div>

              <div>
                <dt className="font-medium text-slate-500">Wholesale Cost</dt>
                <dd className="text-slate-900">
                  {product.wholesale_cost != null
                    ? `$${Number(product.wholesale_cost).toFixed(2)}`
                    : "—"}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-500">Retail Price</dt>
                <dd className="text-slate-900">
                  {product.retail_price != null
                    ? `$${Number(product.retail_price).toFixed(2)}`
                    : "—"}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-500">Availability</dt>
                <dd className="text-slate-900">{product.availability || "—"}</dd>
              </div>

              <div>
                <dt className="font-medium text-slate-500">Status</dt>
                <dd className="text-slate-900">
                  {product.active ? "Active" : "Inactive"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Available Colors
            </h2>

            <form action={updateProductColors}>
              <input type="hidden" name="product_id" value={product.id} />

              <div className="grid grid-cols-2 gap-3">
                {(colors ?? []).map((color) => {
                  const assigned = assignedIds.has(color.id);

                  return (
                    <label
                      key={color.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        name="color_ids"
                        value={color.id}
                        defaultChecked={assigned}
                      />
                      {color.name}
                    </label>
                  );
                })}
              </div>

              <button
                type="submit"
                className="mt-5 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
              >
                Save Colors
              </button>
            </form>
          </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Customer Catalog Settings
          </h2>

          <form action={updateCatalogSettings} className="mt-5 space-y-5">
            <input type="hidden" name="product_id" value={product.id} />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="show_in_customer_catalog"
                  defaultChecked={product.show_in_customer_catalog}
                />
                Show in Customer Catalog
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="local_only"
                  defaultChecked={product.local_only}
                />
                Local Only Product
              </label>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Customer Description
              </label>
              <textarea
                name="customer_description"
                defaultValue={product.customer_description ?? ""}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Customer Image URL
              </label>
              <input
                type="text"
                name="customer_image_url"
                defaultValue={product.customer_image_url ?? ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Catalog Category
                </label>
                <input
                  type="text"
                  name="catalog_category"
                  defaultValue={product.catalog_category ?? ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Catalog Sort Order
                </label>
                <input
                  type="number"
                  name="catalog_sort_order"
                  defaultValue={product.catalog_sort_order ?? 0}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
            >
              Save Catalog Settings
            </button>
          </form>
        </section>
        </div>
      </div>
    </main>
  );
}
